"use client";

import { useState } from "react";
import { unlockInvitationAction } from "@/actions";
import { Lock, Heart, ArrowRight, Loader2 } from "lucide-react";

interface PasswordGateProps {
  invitationId: string;
  brideName: string;
  groomName: string;
}

export function PasswordGate({ invitationId, brideName, groomName }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await unlockInvitationAction(invitationId, password);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-stone-800/90 border border-stone-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center mb-6">
          <Lock className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-widest text-stone-400 font-mono">
          Private Digital Space
        </span>

        <h1 className="text-3xl font-serif text-white mt-2 mb-1">
          {brideName} & {groomName}
        </h1>
        <p className="text-stone-400 text-sm mb-6">
          This celebration invitation is password-protected. Please enter the passcode provided in your invite.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter wedding passcode"
            className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-center text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs tracking-widest uppercase shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Unlock Invitation <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-700/50 flex items-center justify-center gap-2 text-xs text-stone-500">
          <Heart className="w-3.5 h-3.5 text-amber-500" /> WedLink • Privacy by Default
        </div>
      </div>
    </div>
  );
}
