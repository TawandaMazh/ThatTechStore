import type { CartItem } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateGuestToken } from "@/lib/cart/storage";

/**
 * Best-effort guest cart sync to Supabase.
 * Fails quietly if tables are missing or RLS blocks — localStorage remains source of truth.
 */
export async function syncCartToSupabase(items: CartItem[]): Promise<void> {
  try {
    const guestToken = getOrCreateGuestToken();
    if (!guestToken) return;

    const supabase = createClient();

    const { data: existing, error: findError } = await supabase
      .from("carts")
      .select("id")
      .eq("guest_token", guestToken)
      .maybeSingle();

    if (findError) return;

    let cartId = existing?.id as string | undefined;

    if (!cartId) {
      const { data: created, error: createError } = await supabase
        .from("carts")
        .insert({ guest_token: guestToken })
        .select("id")
        .single();
      if (createError || !created) return;
      cartId = created.id;
    } else {
      await supabase
        .from("carts")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", cartId);
    }

    await supabase.from("cart_items").delete().eq("cart_id", cartId);

    if (!items.length) return;

    await supabase.from("cart_items").insert(
      items.map((item) => ({
        cart_id: cartId,
        product_id: item.productId,
        quantity: item.quantity,
      })),
    );
  } catch {
    // Offline / missing env / not seeded — ignore
  }
}
