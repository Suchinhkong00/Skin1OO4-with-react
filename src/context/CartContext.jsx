import { createContext, useContext, useEffect, useState } from "react";

const CART_KEY = "skin1004_cart";
const CartContext = createContext(null);

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  function addToCart(productId, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (existing) {
        return prev.map((i) => (i.id === productId ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id: productId, qty }];
    });
  }

  function updateQty(productId, qty) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === productId ? { ...i, qty } : i)));
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const value = { cart, addToCart, updateQty, removeFromCart, clearCart, cartCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
