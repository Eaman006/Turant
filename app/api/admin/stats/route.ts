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

export async function GET() {
  const clientResult = getAdminSupabaseClient();
  if ("error" in clientResult) {
    return new NextResponse(clientResult.error, { status: 500 });
  }

  const { supabase } = clientResult;

  try {
    // 1. Fetch Total Listings (Cabs + Places) securely from the backend
    const { count: cabsCount } = await supabase
      .from("Cabs")
      .select("*", { count: "exact", head: true });

    const { count: placesCount } = await supabase
      .from("places")
      .select("*", { count: "exact", head: true });

    // 2. Fetch Open Reports securely from the backend (ignoring case sensitivity formatting)
    const { count: openCabsCount } = await supabase
      .from("reports_cabs")
      .select("*", { count: "exact", head: true })
      .ilike("report_status", "%open%");

    const { count: openPlacesCount } = await supabase
      .from("reports_places")
      .select("*", { count: "exact", head: true })
      .ilike("report_status", "%open%");

    return NextResponse.json({
      totalListings: (cabsCount || 0) + (placesCount || 0),
      openReports: (openCabsCount || 0) + (openPlacesCount || 0),
    });
  } catch (error) {
    console.error("Backend Stats Fetch Error:", error);
    return new NextResponse("Internal Server Error calculating dashboard stats.", { status: 500 });
  }
}
