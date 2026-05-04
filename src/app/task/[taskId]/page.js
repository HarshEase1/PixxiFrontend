"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useParams } from "next/navigation";
import { Inter } from "next/font/google";

import { apiEndpoints, baseApi } from "../../baseApi";
// import BackButton from "../../components/BackButton";
// import ReportSection from "@/components/ReportSection";
import BackButton from "@/app/components/BackButton";
import ReportSection from "@/app/components/ReportSection";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});


export default function TaskResultPage() {
  const params = useParams();
  const taskId = params.taskId;

  const [status, setStatus] = useState("loading");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Loading analysis...");
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

  const pollingRef = useRef(null);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const pollTaskStatus = async () => {
    try {
      const data = await baseApi.get(apiEndpoints.taskStatus(taskId));

      setStatus(data.status);
      setProgress(data.progress || 0);
      setMessage(data.message || "");

      if (data.status === "completed") {
        setProgress(100);
        setReport(data.data);
        stopPolling();
      }

      if (data.status === "failed") {
        setError(data.error || "Analysis failed");
        stopPolling();
      }
    } catch (err) {
      setError(err.message || "Failed to check task status");
      stopPolling();
    }
  };

  const loadExistingReport = async () => {
    try {
      setStatus("loading");
      setMessage("Checking saved analysis...");

      const data = await baseApi.get(apiEndpoints.analysis(taskId));

      setReport(data.data);
      setStatus("completed");
      setProgress(100);
      setMessage("Loaded saved analysis");
    } catch {
      setStatus("processing");
      setMessage("Analysis is still running...");
      pollTaskStatus();

      pollingRef.current = setInterval(() => {
        pollTaskStatus();
      }, 5000);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    loadExistingReport();

    return () => {
      stopPolling();
    };
  }, [taskId]);

  const isLoading =
    status === "loading" || status === "pending" || status === "processing";

  return (
    <div className={`min-h-screen relative overflow-hidden ${inter.className}`}>
    <div className="no-print">
    <BackButton />
    </div>

      <Head>
        <title>Analysis Report | Pixii Assignment</title>
        <meta name="description" content="Amazon listing analysis report" />
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
        {isLoading && (
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-3xl w-full bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Analysis Progress
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    Task ID: {taskId}
                  </p>
                </div>

                <div className="text-3xl font-black text-purple-400">
                  {progress}%
                </div>
              </div>

              <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <p className="text-gray-300 font-mono text-sm">{message}</p>

              <div className="mt-6 flex items-center gap-3 text-gray-400 font-mono text-sm">
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Scraping competitors and generating report...
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-2xl w-full bg-black/80 backdrop-blur-lg border border-red-500/30 shadow-2xl rounded-3xl p-8">
              <h3 className="text-3xl font-black text-white mb-3">
                Analysis Failed
              </h3>
              <p className="text-red-300 font-mono">{error}</p>
            </div>
          </div>
        )}

        {report && (
        <div className="no-print flex justify-center mb-8">
            <a
            href={`http://206.189.133.225${apiEndpoints.downloadPdf(taskId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 px-8 py-5 text-white font-black shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40"
            >
            Download PDF Report
            </a>
        </div>
        )}
        {report && <ReportSection report={report} />}
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .report-html-wrapper style {
          display: none;
        }

        .report-html-wrapper .amazon-product-card {
          margin: 0 auto !important;
        }

        .review-scrollbar::-webkit-scrollbar {
  width: 7px;
}

.review-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 999px;
}

.review-scrollbar::-webkit-scrollbar-thumb {
  background: #c4b5fd;
  border-radius: 999px;
}

.review-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #8b5cf6;
}

@media print {
  .no-print {
    display: none !important;
  }

  html,
  body {
    background: #ffffff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .fixed {
    position: absolute !important;
  }

  section,
  article {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  img {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  a {
    text-decoration: none !important;
  }
}
      `}</style>
    </div>
  );
}