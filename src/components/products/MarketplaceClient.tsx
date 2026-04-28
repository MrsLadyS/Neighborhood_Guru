"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ProduceProduct } from "@/data/products";

type Props = {
  products: ProduceProduct[];
};

type CartItem = {
  productId: string;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
};

function parsePrice(price: string): number {
  const numeric = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function MarketplaceClient({ products }: Props) {
  const [qtyInputByProduct, setQtyInputByProduct] = useState<Record<string, string>>(
    Object.fromEntries(products.map((p) => [p.id, String(p.minimumQuantity ?? 1)]))
  );
  const [cart, setCart] = useState<CartItem[]>([]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  function normalizeQuantity(productId: string): number {
    const product = products.find((p) => p.id === productId);
    if (!product) return 1;
    const min = product.minimumQuantity ?? 1;
    const raw = qtyInputByProduct[productId] ?? String(min);
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return min;
    return Math.max(min, Math.floor(parsed));
  }

  function commitQuantity(productId: string) {
    const normalized = normalizeQuantity(productId);
    setQtyInputByProduct((prev) => ({ ...prev, [productId]: String(normalized) }));
  }

  function addToCart(product: ProduceProduct) {
    const quantity = normalizeQuantity(product.id);
    setQtyInputByProduct((prev) => ({ ...prev, [product.id]: String(quantity) }));
    const unitPrice = parsePrice(product.price);
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unit: product.unit,
          unitPrice,
          quantity,
        },
      ];
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
      <ul className="grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <li key={product.id} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="relative mb-4 h-40 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
            </div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl text-[var(--brand-ink)]">{product.name}</h2>
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-sm font-semibold text-[var(--brand-deep)]">
                {product.price}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{product.description}</p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              <span className="font-medium text-[var(--brand-ink)]">Season:</span> {product.season}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              <span className="font-medium text-[var(--brand-ink)]">Unit:</span> {product.unit}
            </p>
            <div className="mt-4 flex items-end justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <div className="min-w-[140px]">
                <label className="block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                  Qty
                </label>
                <input
                  type="number"
                  min={product.minimumQuantity ?? 1}
                  step={1}
                  value={qtyInputByProduct[product.id] ?? String(product.minimumQuantity ?? 1)}
                  onChange={(e) =>
                    setQtyInputByProduct((prev) => ({ ...prev, [product.id]: e.target.value }))
                  }
                  onBlur={() => commitQuantity(product.id)}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
                />
                {product.minimumQuantity && (
                  <p className="mt-1 text-xs text-[var(--muted)]">Minimum order: {product.minimumQuantity}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="rounded-full bg-[var(--brand-deep)] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Add to cart
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h3 className="font-display text-2xl text-[var(--brand-ink)]">Cart</h3>
        {cart.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">Your cart is empty.</p>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {cart.map((item) => (
                <li
                  key={item.productId}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm"
                >
                  <p className="font-medium text-[var(--brand-ink)]">{item.name}</p>
                  <p className="text-[var(--muted)]">
                    {item.quantity} x {item.unit}
                  </p>
                  <p className="text-[var(--muted)]">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-[var(--brand-ink)]">
              Subtotal: ${subtotal.toFixed(2)}
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
