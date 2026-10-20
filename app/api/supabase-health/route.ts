import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Connectivity smoke check — confirms env + network to the Supabase project.
 * Does not require any custom tables (empty DB is fine).
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          source: "supabase.auth.getSession",
          message: error.message,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      source: "supabase.auth.getSession",
      hasSession: Boolean(data.session),
      urlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
