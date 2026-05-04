"use client";

export default function MenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 left-6 z-50 group"
      aria-label="Open analysis history"
    >
      <div className="relative w-14 h-14 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-500/20 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10 space-y-1.5">
          <span className="block w-6 h-0.5 bg-white rounded-full transition-transform duration-300 group-hover:translate-x-1"></span>
          <span className="block w-6 h-0.5 bg-white rounded-full transition-transform duration-300"></span>
          <span className="block w-6 h-0.5 bg-white rounded-full transition-transform duration-300 group-hover:-translate-x-1"></span>
        </div>

        <div className="absolute inset-0 rounded-2xl ring-2 ring-white/10"></div>
      </div>
    </button>
  );
}