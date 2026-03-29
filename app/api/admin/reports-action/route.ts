import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // This highly privileged key bypasses all Row Level Security (RLS) blocks safely on the server!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const supabaseKey = serviceRoleKey || anonKey;

  if (!supabaseUrl || !supabaseKey) {
    return { error: "Missing Supabase environment variables on server." };
  }

  return {
    supabase: createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    }),
  };
}

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const reportId = body.id;
    const type = body.type; // 'cab' or 'place'
    const status = body.status; // 'closed'

    if (!reportId || !type || !status) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const clientResult = getAdminSupabaseClient();
    if ("error" in clientResult) {
      return new NextResponse(clientResult.error, { status: 500 });
    }

    const { supabase } = clientResult;
    const table = type === "cab" ? "reports_cabs" : "reports_places";

    const { error: updateError } = await supabase
      .from(table)
      .update({ report_status: status })
      .eq("id", reportId);

    if (updateError) {
      return new NextResponse(updateError.message, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin Report Action Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
