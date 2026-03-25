import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // For now we just accept the report and log it.
    // Later this can be stored in DB / sent to admin.
    console.log("[report-driver]", {
      driver_id: body?.driver_id ?? null,
      driver_name: body?.driver_name ?? null,
      phone_number: body?.phone_number ?? null,
      vehicle_type: body?.vehicle_type ?? null,
      vehicle: body?.vehicle ?? null,
      reason: body?.reason ?? "",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return new NextResponse("Invalid request", { status: 400 });
  }
}

