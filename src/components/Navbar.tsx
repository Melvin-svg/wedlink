import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/actions";
import { Sparkles, Heart, LayoutDashboard, LogOut, PlusCircle } from "lucide-react";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Wed<span className="text-amber-700">Link</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-950 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-stone-500" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/invitations/new"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-700" /> New Invite
              </Link>
              <form
                action={async () => {
                  "use server";
                  await logoutAction();
                }}
                className="inline-block"
              >
                <button
                  type="submit"
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition px-2 py-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-950 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide uppercase shadow-sm transition transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Create Free</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
