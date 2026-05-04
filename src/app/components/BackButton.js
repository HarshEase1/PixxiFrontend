"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="fixed top-6 left-6 z-50 group"
      aria-label="Back to home"
    >
      <div className="relative h-14 px-5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-3 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-500/20 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <svg
          className="relative z-10 w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.4}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>

        <span className="relative z-10 text-white font-bold text-sm">
          Back
        </span>

        <div className="absolute inset-0 rounded-2xl ring-2 ring-white/10"></div>
      </div>
    </button>
  );
}