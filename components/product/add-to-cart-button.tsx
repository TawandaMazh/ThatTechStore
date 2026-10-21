"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  product,
  disabled,
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const label = product.isPreorder ? "Pre-order with deposit" : "Add to cart";

  return (
    <Button
      variant="primary"
      size="lg"
      className={className ?? "w-full sm:w-auto"}
      disabled={disabled}
      onClick={() => {
        addItem(product, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? "Added to cart" : label}
    </Button>
  );
}
