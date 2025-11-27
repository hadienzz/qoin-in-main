"use client";

import { useState } from "react";
import { POSCartItem } from "@/app/dashboard/components/dashboard/pos-cart-item";
import { POSSummary } from "@/app/dashboard/components/dashboard/pos-summary";
import { FilterBar } from "@/app/dashboard/components/dashboard/filter-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Merchant, Stock } from "@/types";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type POSPageProps = {
  merchant?: Merchant | null;
};

export function POSPage({ merchant }: POSPageProps) {
  const [cart, setCart] = useState<
    Array<CartItem>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);

  const products: Stock[] = merchant?.stocks ?? [];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addToCart = (product: Stock) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    alert(`Order completed! Total: Rp ${total.toLocaleString()}`);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-8">
      <div>
        <h1 className="text-foreground text-2xl font-bold md:text-3xl">
          Point of Sale
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage your sales transactions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Products */}
        <div className="space-y-4 lg:col-span-2">
          <FilterBar
            onSearch={setSearchQuery}
            searchPlaceholder="Search products..."
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate font-semibold">
                        {product.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {/* Category belum ada di Stock, tampilkan deskripsi pendek */}
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold md:text-lg">
                      Rp {product.price.toLocaleString()}
                    </p>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="hidden space-y-4 lg:block">
          <div className="bg-card border-border rounded-md border p-4">
            <h2 className="text-foreground mb-4 font-bold">Shopping Cart</h2>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-sm">Cart is empty</p>
              ) : (
                cart.map((item) => (
                  <POSCartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))
              )}
            </div>
          </div>
          <POSSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            onCheckout={handleCheckout}
          />
        </div>

        <div className="lg:hidden">
          <Button
            onClick={() => setShowCart(!showCart)}
            className="w-full"
            variant={cart.length > 0 ? "default" : "outline"}
          >
            View Cart ({cart.length})
          </Button>

          {showCart && (
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setShowCart(false)}
            />
          )}

          {showCart && (
            <div className="bg-card border-border fixed right-0 bottom-0 left-0 z-50 max-h-96 overflow-y-auto rounded-t-lg border-t p-4">
              <div className="space-y-3">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Cart is empty</p>
                ) : (
                  cart.map((item) => (
                    <POSCartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      quantity={item.quantity}
                      onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))
                )}
              </div>
              <div className="border-border mt-4 border-t pt-4">
                <POSSummary
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
