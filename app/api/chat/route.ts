import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseKey = serviceRoleKey || anonKey;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

function jsonToMarkdownTable(data: any[], tableName: string): string {
  if (!data || data.length === 0) return `\n\n### ${tableName} DATABASE\nNo data available.`;
  
  const headers = Object.keys(data[0]);
  let md = `\n\n### ${tableName} DATABASE\n`;
  md += `| ${headers.join(' | ')} |\n`;
  md += `| ${headers.map(() => '---').join(' | ')} |\n`;
  
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      return val !== null && val !== undefined ? String(val).replace(/\|/g, '\\|').replace(/\n/g, ' ') : '';
    });
    md += `| ${values.join(' | ')} |\n`;
  }
  return md;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { history } = body; // Array of { role: 'user' | 'model', parts: [{ text: string }] }
    
    if (!history || !Array.isArray(history)) {
      return NextResponse.json({ error: "Invalid history array" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY environment variable" }, { status: 500 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });
    }

    // 1. Fetch tables
    const [cabsResult, placesResult] = await Promise.all([
      supabase.from("Cabs").select("*"),
      supabase.from("places").select("*")
    ]);

    // 2. Format to Markdown
    let databaseString = "";
    if (cabsResult.data) databaseString += jsonToMarkdownTable(cabsResult.data, "CABS");
    if (placesResult.data) databaseString += jsonToMarkdownTable(placesResult.data, "PLACES");

    // 3. Define the System Prompt
    const turant_system_prompt = `
You are Turant AI, a helpful community assistant for local services in the VIT Bhopal area.
Your goal is to help users find drivers, restaurants, and services from the database provided below.

RULES:
1. Greet the user and ask how you can help them with local services today.
2. ONLY use the information in the provided database to answer. 
3. If a user asks for something not in the database, politely inform them.
4. If multiple options exist, list them both clearly.
5. Keep responses conversational, short, and friendly.
6. Return responses formatted in Markdown.

DATABASE:
${databaseString}
`;

    // 4. Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // Use gemini-2.5-flash as the standard chat model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: turant_system_prompt 
    });

    let formattedHistory = history.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }]
    }));

    // Gemini API enforces that history must begin with 'user'.
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
       formattedHistory.shift();
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    // 5. Send message
    const lastUserMessage = history[history.length - 1];
    const result = await chat.sendMessage(lastUserMessage.content);
    
    return NextResponse.json({ text: result.response.text() });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
