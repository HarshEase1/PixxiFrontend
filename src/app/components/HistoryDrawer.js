"use client";

import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function HistoryDrawer({
  isOpen,
  onClose,
  historyItems,
  loading,
  error,
  selectedTaskId,
  onSelectHistory,
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-6 left-6 z-50 h-[80vh] w-[30vw] min-w-[340px] max-w-[520px] rounded-[2rem] overflow-hidden transition-all duration-500 ease-out ${
          isOpen
            ? "translate-x-0 opacity-100 scale-100"
            : "-translate-x-[120%] opacity-0 scale-95"
        }`}
      >
        <div className="relative h-full bg-white/10 backdrop-blur-2xl border border-white/30 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 rounded-[2rem] border-[6px] border-white/10 pointer-events-none"></div>
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/25 to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10 p-6 border-b border-white/15">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-purple-200 mb-2">
                  Dashboard Menu
                </p>
                <h3
                  className={`${spaceGrotesk.className} text-3xl font-black text-white`}
                >
                  Analysis History
                </h3>
                <p className="text-sm text-white/60 mt-2">
                  Open previous Amazon listing reports.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-200"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="relative z-10 p-5 h-[calc(80vh-140px)] overflow-y-auto custom-scrollbar">
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-white font-semibold">Loading history...</p>
                <p className="text-white/50 text-sm mt-1">
                  Fetching saved reports
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="p-5 rounded-3xl bg-red-500/15 border border-red-400/30 text-red-100">
                <p className="font-bold mb-1">Could not load history</p>
                <p className="text-sm text-red-100/80">{error}</p>
              </div>
            )}

            {!loading && !error && historyItems.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl mb-5">
                  📭
                </div>
                <h4 className="text-xl font-black text-white mb-2">
                  No reports yet
                </h4>
                <p className="text-white/55 text-sm max-w-xs">
                  Run your first ASIN analysis and it will appear here.
                </p>
              </div>
            )}

            {!loading && !error && historyItems.length > 0 && (
              <div className="space-y-4">
                {historyItems.map((item, index) => (
                  <button
                    key={item.task_id}
                    onClick={() => onSelectHistory(item.task_id)}
                    disabled={selectedTaskId === item.task_id}
                    className="w-full text-left group rounded-3xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 p-4 transition-all duration-300 hover:translate-x-1 disabled:opacity-70 disabled:cursor-wait"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center text-white font-black shadow-lg">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="px-3 py-1 rounded-full bg-black/30 border border-white/10 text-white text-xs font-mono">
                            {item.asin}
                          </span>

                          <span className="text-xs text-white/45 font-mono">
                            {formatHistoryDate(item.created_at)}
                          </span>
                        </div>

                        <h4 className="text-white font-bold leading-snug line-clamp-2 group-hover:text-purple-100 transition-colors">
                          {item.your_product_title || "Untitled Product"}
                        </h4>

                        <div className="flex items-center gap-3 mt-3 text-xs text-white/55 font-mono">
                          <span>🎯 {item.competitors_count} competitors</span>
                          <span>•</span>
                          <span>
                            {selectedTaskId === item.task_id
                              ? "Opening..."
                              : "Open report"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function formatHistoryDate(value) {
  if (!value) return "";

  try {
    const date = new Date(value);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}