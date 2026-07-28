import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { seedProducts } from "../data/seedProducts";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        if (snapshot.empty) {
          // Firestore reachable but not seeded yet — show local data so the
          // storefront isn't empty (run `npm run seed`, or use the "Import
          // Sample Products" button in the admin dashboard, to populate Firestore).
          setProducts(seedProducts);
          setUsingFallback(true);
        } else {
          setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          setUsingFallback(false);
        }
        setLoading(false);
      },
      () => {
        setProducts(seedProducts);
        setUsingFallback(true);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  async function createProduct(product) {
    await addDoc(collection(db, "products"), {
      ...product,
      price: Number(product.price),
      createdAt: serverTimestamp(),
    });
  }

  async function updateProduct(id, updates) {
    await updateDoc(doc(db, "products", id), {
      ...updates,
      price: Number(updates.price),
      updatedAt: serverTimestamp(),
    });
  }

  async function deleteProduct(id) {
    await deleteDoc(doc(db, "products", id));
  }

  // One-time import: writes the local seedProducts array into Firestore as
  // real documents (with Firestore-assigned IDs), so the onSnapshot listener
  // above picks them up and usingFallback flips back to false automatically.
  async function seedFirestoreWithSampleProducts() {
    const batch = writeBatch(db);
    seedProducts.forEach((product) => {
      const { id, ...rest } = product; // drop the local fallback id
      const ref = doc(collection(db, "products"));
      batch.set(ref, {
        ...rest,
        price: Number(rest.price),
        createdAt: serverTimestamp(),
      });
    });
    await batch.commit();
  }

  const value = {
    products,
    loading,
    usingFallback,
    createProduct,
    updateProduct,
    deleteProduct,
    seedFirestoreWithSampleProducts,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}