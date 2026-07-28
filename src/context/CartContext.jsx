import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const getCartKey = (uid) => `skin1004_cart_${uid}`;
const CartContext = createContext(null);

function readCart(uid) {
  try {
    const raw = localStorage.getItem(getCartKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(uid, cart) {
  try {
    localStorage.setItem(getCartKey(uid), JSON.stringify(cart));
  } catch {
    // localStorage may be unavailable (private mode, quota exceeded) — fail silently
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { currentUser } = useAuth();

  // Tracks whose cart is currently loaded, so we don't accidentally
  // write an empty array over a user's saved cart before it's loaded.
  const loadedUidRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      loadedUidRef.current = null;
      setCart([]);
      return;
    }
    setCart(readCart(currentUser.uid));
    loadedUidRef.current = currentUser.uid;
  }, [currentUser]);

  // Persist to localStorage any time the cart changes, but only once
  // we've confirmed which user's cart is currently loaded.
  useEffect(() => {
    if (!currentUser || loadedUidRef.current !== currentUser.uid) return;
    writeCart(currentUser.uid, cart);
  }, [cart, currentUser]);

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