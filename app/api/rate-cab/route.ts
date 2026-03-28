import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Helper to use service role key if available, otherwise fallback to anon key
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cabId = searchParams.get("cabId");
  const userId = searchParams.get("userId");

  if (!cabId || !userId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const clientResult = getSupabaseClient();
  if ("error" in clientResult) return NextResponse.json({ error: clientResult.error }, { status: 500 });
  const { supabase } = clientResult;

  const { data, error } = await supabase
    .from("Cabs")
    .select("all_ratings, rating_users")
    .eq("id", cabId)
    .single();

  if (error || !data) {
    return NextResponse.json({ existingRating: 0 });
  }

  const all_ratings = data.all_ratings || [];
  const rating_users = data.rating_users || [];

  const userIdx = rating_users.indexOf(userId);
  if (userIdx > -1 && all_ratings[userIdx] !== undefined) {
    return NextResponse.json({ existingRating: Number(all_ratings[userIdx]) });
  }

  return NextResponse.json({ existingRating: 0 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cabId, userId, rating } = body;

    if (!cabId || !userId || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const clientResult = getSupabaseClient();
    if ("error" in clientResult) return NextResponse.json({ error: clientResult.error }, { status: 500 });
    const { supabase } = clientResult;

    const { data: cabData, error: cabError } = await supabase
      .from("Cabs")
      .select("all_ratings, rating_users, ratings_count")
      .eq("id", cabId)
      .single();

    if (cabError) {
      if (cabError.message.includes("rating_users")) {
        return NextResponse.json(
          {
            error:
              "Please add a 'rating_users' column of type 'text[]' to your 'Cabs' table in Supabase to track user ratings and allow editing.",
          },
          { status: 500 }
        );
      }
      return NextResponse.json({ error: "Cab not found or database error" }, { status: 404 });
    }

    const all_ratings: number[] = cabData.all_ratings || [];
    const rating_users: string[] = cabData.rating_users || [];

    const userIdx = rating_users.indexOf(userId);

    if (userIdx > -1) {
      all_ratings[userIdx] = rating;
    } else {
      all_ratings.push(rating);
      rating_users.push(userId);
    }

    const sum = all_ratings.reduce((a, b) => a + Number(b), 0);
    const avg = all_ratings.length > 0 ? (sum / all_ratings.length).toFixed(1) : "0.0";

    const { data: updateData, error: updateError } = await supabase
      .from("Cabs")
      .update({
        all_ratings,
        rating_users,
        actual_rating: avg,
        ratings_count: all_ratings.length,
      })
      .eq("id", cabId)
      .select();

    if (updateError) {
      return NextResponse.json({ error: updateError.message || "Failed to update driver rating." }, { status: 500 });
    }

    if (!updateData || updateData.length === 0) {
      return NextResponse.json({ 
        error: "Action blocked by Supabase Row-Level Security (RLS) policies. Please allow UPDATE access on 'Cabs' table or use SUPABASE_SERVICE_ROLE_KEY in .env.local to bypass RLS." 
      }, { status: 403 });
    }

    return NextResponse.json({ success: true, newAverage: avg, newCount: all_ratings.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
