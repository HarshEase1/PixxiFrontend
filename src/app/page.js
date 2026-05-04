"use client";

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

import { apiEndpoints, baseApi } from "./baseApi";
import MenuButton from "./components/MenuButton";
import HistoryDrawer from "./components/HistoryDrawer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Home() {
  const router = useRouter();

  const [asin, setAsin] = useState("");
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [selectedHistoryTaskId, setSelectedHistoryTaskId] = useState(null);

  const isLoading = status === "pending";

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const data = await baseApi.get(apiEndpoints.history);
      setHistoryItems(data.results || []);
    } catch (err) {
      setHistoryError(err.message || "Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenMenu = async () => {
    setIsMenuOpen(true);
    await fetchHistory();
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSelectHistory = async (taskId) => {
    setSelectedHistoryTaskId(taskId);
    router.push(`/task/${taskId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanAsin = asin.trim().toUpperCase();

    if (cleanAsin.length !== 10) {
      setError("ASIN must be 10 characters.");
      return;
    }

    try {
      setStatus("pending");
      setError("");

      const data = await baseApi.post(apiEndpoints.analyze, {
        asin: cleanAsin,
      });

      router.push(`/task/${data.task_id}`);
    } catch (err) {
      setStatus("failed");
      setError(err.message || "Failed to start analysis");
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${inter.className}`}>
      <MenuButton onClick={handleOpenMenu} />

      <HistoryDrawer
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        historyItems={historyItems}
        loading={historyLoading}
        error={historyError}
        selectedTaskId={selectedHistoryTaskId}
        onSelectHistory={handleSelectHistory}
      />

      <Head>
        <title>Amazon Listing Optimizer | Built for Pixii</title>
        <meta
          name="description"
          content="AI-powered Amazon listing optimization"
        />
      </Head>

      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <main className="container mx-auto px-6 py-12 relative">
        <header className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
            </div>

            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                pixii
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                Assignment Build
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-6xl md:text-7xl font-black leading-tight">
              <span className="block">Turn Your</span>
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent block">
                Amazon Listing
              </span>
              <span className="block">Into a Sales Machine</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-mono">
              AI-powered analysis that shows you{" "}
              <span className="text-purple-600 font-bold">exactly</span> what
              to fix.
              <br />
              Compare against competitors in{" "}
              <span className="text-blue-600 font-bold">30 seconds</span>.
            </p>
          </div>
        </header>

        <div className="max-w-3xl mx-auto mb-12">
          <div
            className={`bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12 transition-all duration-300 ${
              focused ? "ring-4 ring-purple-500/50" : ""
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="asin"
                  className="block text-lg font-bold text-white mb-4"
                >
                  Enter Your Amazon ASIN
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="asin"
                    value={asin}
                    onChange={(e) => {
                      setAsin(e.target.value.toUpperCase());
                      if (error) setError("");
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="B08XYZABC"
                    maxLength={10}
                    disabled={isLoading}
                    className="w-full px-6 py-5 text-2xl font-bold font-mono border-4 border-gray-200 rounded-2xl focus:border-purple-600 focus:outline-none transition-all duration-200 disabled:opacity-60"
                  />

                  <div className="absolute right-4 bottom-4 text-sm font-mono text-gray-400">
                    {asin.length}/10
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-400 font-mono">
                  💡 Example:{" "}
                  <span className="font-bold text-purple-400">B0DWMQDYSZ</span>{" "}
                  or{" "}
                  <span className="font-bold text-purple-400">B08X6BK4D4</span>
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 font-mono text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={asin.length !== 10 || isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold px-8 py-6 rounded-xl hover:shadow-lg hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Starting Analysis...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Analyze My Listing
                    </>
                  )}
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-20">
          <h3 className="text-4xl font-black text-center mb-12">
            How It{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              Works
            </span>
          </h3>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: "🔍",
                title: "Scrape",
                desc: "We extract your listing data from Amazon",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: "🎯",
                title: "Compare",
                desc: "Find and analyze top 3 competitors",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: "🤖",
                title: "Analyze",
                desc: "AI compares and identifies gaps",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: "✨",
                title: "Optimize",
                desc: "Get specific recommendations to improve",
                color: "from-orange-500 to-orange-600",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-6 hover:-translate-y-2 hover:shadow-purple-500/50 transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-400 font-mono">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center space-y-4 py-12 border-t border-gray-800">
          <p className="text-sm text-gray-500 font-mono">
            Created by{" "}
            <span className="font-bold text-purple-600">Harsh Tripathi</span>{" "}
            for Pixii Assignment
          </p>
        </footer>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 999px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 999px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}