import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const cabId = body?.cab_id ?? body?.driver_id ?? null;
    const reasonRaw = typeof body?.reason === "string" ? body.reason : "";
    const reason = reasonRaw.trim();
    const reporterId =
      typeof body?.reporter_id === "string" ? body.reporter_id.trim() : "";
    const reporterName =
      typeof body?.reporter_name === "string" ? body.reporter_name.trim() : "";

    if (!cabId) {
      return new NextResponse("Missing cab_id", { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseKey = serviceRoleKey || anonKey;

    if (!supabaseUrl || !supabaseKey) {
      return new NextResponse(
        "Missing Supabase environment variables on server.",
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Prefer creating a new row. If `cab_id` is unique and insert conflicts,
    // append the reason into the existing row instead.
    const { error: insertError } = await supabase.from("reports").insert({
      cab_id: cabId,
      reason,
      reporter_id: reporterId,
      reporter_name: reporterName,
    });

    if (!insertError) {
      return NextResponse.json({ ok: true, mode: "inserted" });
    }

    // Handle duplicate-key on cab_id (unique constraint) by appending.
    const code = (insertError as any)?.code;
    if (code !== "23505") {
      return new NextResponse(insertError.message, { status: 500 });
    }

    const { data: existingRows, error: fetchError } = await supabase
      .from("reports")
      .select("id, reason")
      .eq("cab_id", cabId)
      .order("id", { ascending: false })
      .limit(1);

    if (fetchError) {
      return new NextResponse(fetchError.message, { status: 500 });
    }

    const existing = existingRows?.[0];
    if (!existing?.id) {
      return new NextResponse("Report exists but could not be fetched.", {
        status: 500,
      });
    }

    const updatedReason =
      existing.reason && reason ? `${existing.reason}\n---\n${reason}` : existing.reason || reason;

    const { error: updateError } = await supabase
      .from("reports")
      .update({
        reason: updatedReason,
        reporter_id: reporterId || null,
        reporter_name: reporterName || null,
      })
      .eq("id", existing.id);

    if (updateError) {
      return new NextResponse(updateError.message, { status: 500 });
    }

    return NextResponse.json({ ok: true, mode: "updated" });
  } catch (e) {
    return new NextResponse("Invalid request", { status: 400 });
  }
}

