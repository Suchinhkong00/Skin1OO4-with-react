import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load orders:", error);
        setOrders([]);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [currentUser]);

  async function createOrder({ items, subtotal, shipping, paymentMethod }) {
    if (!currentUser) throw new Error("Must be signed in to place an order.");
    const ref = await addDoc(collection(db, "orders"), {
      userId: currentUser.uid,
      items,
      subtotal,
      shipping,
      paymentMethod,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }

  const value = { orders, loading, createOrder };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}