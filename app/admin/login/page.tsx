"use client";

import { FormEvent, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const adminRef = doc(db, "admins", credential.user.uid);
      const adminSnapshot = await getDoc(adminRef);

      if (
        !adminSnapshot.exists() ||
        adminSnapshot.data().role !== "admin"
      ) {
        await signOut(auth);
        setError("This account is not authorized to access the admin panel.");
        return;
      }

      router.push("/admin");
    } catch {
      await signOut(auth).catch(() => {});

      setError("Invalid email, password, or admin account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background-soft)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-light)]">
            <span className="text-xl font-bold text-[var(--primary)]">
              J
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[var(--dark)]">
            Jaji Electronics
          </h1>

          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            Admin Dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[var(--dark)]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@jajielectronics.pk"
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-4 text-sm text-[var(--dark)] outline-none transition-colors placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[var(--dark)]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-4 text-sm text-[var(--dark)] outline-none transition-colors placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-[var(--primary)] text-sm font-semibold !text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-light)]">
          Authorized personnel only
        </p>
      </div>
    </main>
  );
}