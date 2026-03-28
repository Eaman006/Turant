import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = typeof body?.user_id === "string" ? body.user_id.trim() : "";
    const listingId = body?.listing_id ?? null;
    const listingCabsId = body?.listingcabs_id ?? null;
    const action = typeof body?.action === "string" ? body.action.trim() : "";

    if (!userId) return new NextResponse("Missing user_id", { status: 400 });
    if (!listingId && !listingCabsId) return new NextResponse("Missing listing ID", { status: 400 });
    if (!action) return new NextResponse("Missing action", { status: 400 });

    const clientResult = getSupabaseClient();
    if ("error" in clientResult) return new NextResponse(clientResult.error, { status: 500 });
    const { supabase } = clientResult;

    if (action === "save") {
      const { error } = await supabase.from("saved_contacts").insert({
        user_id: userId,
        listing_id: listingId,
        listingcabs_id: listingCabsId,
      });
      // Ignore unique constraint errors silently (code 23505)
      if (error && error.code !== "23505") {
        return new NextResponse(error.message, { status: 500 });
      }
      return NextResponse.json({ ok: true, saved: true });
    } else if (action === "unsave") {
      let query = supabase.from("saved_contacts").delete().eq("user_id", userId);
      if (listingCabsId) {
        query = query.eq("listingcabs_id", listingCabsId);
      } else if (listingId) {
        query = query.eq("listing_id", listingId);
      }
      const { error } = await query;
      if (error) return new NextResponse(error.message, { status: 500 });
      return NextResponse.json({ ok: true, saved: false });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch {
    return new NextResponse("Invalid request", { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) return new NextResponse("Missing user_id", { status: 400 });

    const clientResult = getSupabaseClient();
    if ("error" in clientResult) return new NextResponse(clientResult.error, { status: 500 });
    const { supabase } = clientResult;

    const { data, error } = await supabase
      .from("saved_contacts")
      .select("listing_id, listingcabs_id")
      .eq("user_id", userId);

    if (error) return new NextResponse(error.message, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return new NextResponse("Invalid request", { status: 400 });
  }
}
