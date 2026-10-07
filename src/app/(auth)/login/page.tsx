"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions";
import { Heart, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-white shadow-sm">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-serif text-3xl font-bold tracking-tight text-stone-900">
            Wed<span className="text-amber-700">Link</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-serif text-stone-900">
          Welcome back
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600">
          Sign in to manage your wedding invitation &amp; RSVPs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl border border-stone-200/80 rounded-3xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="melvin@example.com"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-stone-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-amber-700 hover:text-amber-800 underline">
              Create Free Workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
