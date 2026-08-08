import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // "admin" | "customer" | null
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          setRole(snap.exists() ? snap.data().role : "customer");
        } catch {
          setRole("customer");
        }
      } else {
        setRole(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  async function register(name, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      email,
      role: "customer",
      createdAt: serverTimestamp(),
    });
    return cred.user;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Firebase's onAuthStateChanged only fires on sign-in/sign-out, not on
  // profile edits (e.g. updateProfile changing displayName). After updating
  // a profile elsewhere (like the Profile page), call this to reload the
  // current user from Firebase and push the fresh data into state, so
  // anything reading currentUser (like the Navbar) re-renders with it.
  async function refreshUser() {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setCurrentUser({ ...auth.currentUser });
  }

  const value = {
    currentUser,
    role,
    isAdmin: role === "admin",
    authLoading,
    register,
    login,
    logout,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}