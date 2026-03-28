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

    const placesId = body?.places_id ?? null;
    const reasonRaw = typeof body?.reason === "string" ? body.reason : "";
    const reason = reasonRaw.trim();
    const reporterId =
      typeof body?.reporter_id === "string" ? body.reporter_id.trim() : "";
    const reporterName =
      typeof body?.reporter_name === "string" ? body.reporter_name.trim() : "";

    if (!placesId) return new NextResponse("Missing places_id", { status: 400 });

    const clientResult = getSupabaseClient();

    if ("error" in clientResult) {
      return new NextResponse(clientResult.error, { status: 500 });
    }

    const { supabase } = clientResult;

    const { error: insertError } = await supabase.from("reports_places").insert({
      places_id: placesId,
      reason,
      reporter_id: reporterId,
      reporter_name: reporterName,
      report_status: "open",
    });

    if (!insertError) {
      return NextResponse.json({ ok: true, mode: "inserted" });
    }

    // If places_id is unique, append into the existing row.
    const code = (insertError as any)?.code;
    if (code !== "23505") {
      return new NextResponse(insertError.message, { status: 500 });
    }

    const { data: existingRows, error: fetchError } = await supabase
      .from("reports_places")
      .select("id, reason")
      .eq("places_id", placesId)
      .order("id", { ascending: false })
      .limit(1);

    if (fetchError) return new NextResponse(fetchError.message, { status: 500 });

    const existing = existingRows?.[0];
    if (!existing?.id) {
      return new NextResponse("Report exists but could not be fetched.", {
        status: 500,
      });
    }

    const updatedReason =
      existing.reason && reason
        ? `${existing.reason}\n---\n${reason}`
        : existing.reason || reason;

    const { error: updateError } = await supabase
      .from("reports_places")
      .update({
        reason: updatedReason,
        reporter_id: reporterId || null,
        reporter_name: reporterName || null,
        report_status: "open",
      })
      .eq("id", existing.id);

    if (updateError) return new NextResponse(updateError.message, { status: 500 });

    return NextResponse.json({ ok: true, mode: "updated" });
  } catch {
    return new NextResponse("Invalid request", { status: 400 });
  }
}

