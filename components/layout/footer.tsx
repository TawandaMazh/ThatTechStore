import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-elevated">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold text-text">
            ThatTechStore
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Premium tech for Lusaka — cooling, power backup, storm gear, and
            checked phones. Delivery across all Lusaka areas.
          </p>
        </div>

        <div className="flex gap-12 text-sm">
          <div>
            <p className="font-medium text-text">Shop</p>
            <ul className="mt-3 space-y-2 text-text-muted">
              <li>
                <Link href="/products?category=too-hot" className="hover:text-text">
                  Too hot
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=power-cuts"
                  className="hover:text-text"
                >
                  Power cuts
                </Link>
              </li>
              <li>
                <Link href="/products?category=storms" className="hover:text-text">
                  Storms
                </Link>
              </li>
              <li>
                <Link href="/products?category=phones" className="hover:text-text">
                  Phones
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-text">Info</p>
            <ul className="mt-3 space-y-2 text-text-muted">
              <li>
                <Link href="/track" className="hover:text-text">
                  Track order
                </Link>
              </li>
              <li>
                <Link href="/pre-order" className="hover:text-text">
                  Pre-order
                </Link>
              </li>
              <li>Delivery: all Lusaka</li>
            </ul>
          </div>
        </div>
      </Container>
      <Container className="border-t border-border py-5">
        <p className="text-xs text-text-subtle">
          © 2026 ThatTechStore. Lusaka, Zambia.
        </p>
      </Container>
    </footer>
  );
}
