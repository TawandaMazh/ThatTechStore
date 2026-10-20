"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      variant="primary"
      size="lg"
      className="w-full sm:w-auto"
      disabled={disabled}
      onClick={() => {
        addItem(product, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? "Added to cart" : "Add to cart"}
    </Button>
  );
}
