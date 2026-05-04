"use client";

import { Space_Grotesk } from "next/font/google";
import AnalysisMarkdown from "./AnalysisMarkdown";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});




export default function ReportSection({ report }) {
  const yourProductHtml = report?.html_previews?.your_product || "";
  const competitorHtmls = report?.html_previews?.competitors || [];

  return (
    <div className="max-w-7xl mx-auto mb-20 space-y-10">
      <div className="text-center pt-20">
        <h3 className={`${spaceGrotesk.className} text-5xl font-black mb-4`}>
          Your{" "}
          <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
            Analysis Report
          </span>
        </h3>
        <p className="text-gray-500 font-mono">
          Completed successfully. Here is your listing, competitors, and AI
          recommendations.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <SummaryCard
          title="Your ASIN"
          value={report?.your_product?.asin || "N/A"}
          icon="📦"
        />
        <SummaryCard
          title="Competitors"
          value={report?.competitors?.length || 0}
          icon="🎯"
        />
        <SummaryCard
          title="Rating"
          value={report?.your_product?.rating || "N/A"}
          icon="⭐"
        />
        <SummaryCard
          title="Price"
          value={report?.your_product?.price || "N/A"}
          icon="💰"
        />
      </div>

      <section className="bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-6 md:p-8">
        <h4 className="text-3xl font-bold text-white mb-6">
          Your Product Preview
        </h4>

        <div
          className="report-html-wrapper bg-white rounded-2xl p-4 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: yourProductHtml }}
        />
      </section>



      <section className="bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-6 md:p-8">
        <h4 className="text-3xl font-bold text-white mb-6">
          Competitor Previews
        </h4>

        <div className="grid lg:grid-cols-3 gap-6">
          {competitorHtmls.map((html, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 overflow-x-auto"
            >
              <div className="mb-3 text-sm font-bold text-gray-500 font-mono">
                Competitor #{index + 1}
              </div>

              <div
                className="report-html-wrapper"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          ))}
        </div>
      </section>


      <section className="bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-sm font-mono text-purple-300 uppercase tracking-wider mb-2">
              AI Listing Audit
            </p>
            <h4
              className={`${spaceGrotesk.className} text-3xl md:text-4xl font-black text-white`}
            >
              Optimization Recommendations
            </h4>
          </div>

          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-sm font-mono">
            Report Ready
          </div>
        </div>

        <AnalysisMarkdown text={report?.analysis || ""} />
      </section>

            <ReviewComparisonSection
        yourProduct={report?.your_product}
        competitors={report?.competitors || []}
      />

                  {report?.your_product?.improved_image_url && (
        <section className="bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <p className="text-sm font-mono text-purple-300 uppercase tracking-wider mb-2">
                AI Creative Upgrade
              </p>
              <h4
                className={`${spaceGrotesk.className} text-3xl md:text-4xl font-black text-white`}
              >
                Improved Ecommerce Image
              </h4>
              <p className="text-gray-400 font-mono text-sm mt-2">
                One enhanced hero image generated from your original product image.
              </p>
            </div>

            <div className="px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm font-mono">
              Image Ready
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-500 font-mono mb-3">
                Original Product Image
              </p>
              <img
                src={report?.your_product?.image_url}
                alt="Original product"
                className="w-full max-h-[520px] object-contain rounded-xl bg-gray-50"
              />
            </div>

            <div className="bg-white rounded-2xl p-5 border-4 border-purple-100">
              <p className="text-sm font-bold text-purple-600 font-mono mb-3">
                AI Improved Image
              </p>
              <img
                src={report?.your_product?.improved_image_url}
                alt="Improved ecommerce product"
                className="w-full max-h-[520px] object-contain rounded-xl bg-gray-50"
              />

              <a
                href={report?.your_product?.improved_image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-bold text-white hover:scale-105 transition-transform"
              >
                Open Improved Image
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <p className="text-gray-400 font-mono text-sm mb-2">{title}</p>
      <h4 className="text-2xl font-black text-white break-words">{value}</h4>
    </div>
  );
}

function ReviewComparisonSection({ yourProduct, competitors }) {
  const yourReviews = yourProduct?.reviews || [];
  const totalCompetitorReviews = competitors.reduce((total, competitor) => {
    return total + (competitor?.reviews?.length || 0);
  }, 0);

  const hasAnyReviews = yourReviews.length > 0 || totalCompetitorReviews > 0;

  if (!hasAnyReviews) {
    return (
      <section className="bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="text-sm font-mono text-purple-300 uppercase tracking-wider mb-2">
              Customer Voice
            </p>
            <h4
              className={`${spaceGrotesk.className} text-3xl md:text-4xl font-black text-white`}
            >
              Review Snapshot
            </h4>
          </div>

          <div className="px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm font-mono">
            No Reviews Found
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <p className="text-gray-600 font-mono text-sm">
            No review text was found for this product or its competitors. Amazon
            may have blocked the review page, or the product has limited visible
            reviews.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-sm font-mono text-purple-300 uppercase tracking-wider mb-2">
            Customer Voice
          </p>
          <h4
            className={`${spaceGrotesk.className} text-3xl md:text-4xl font-black text-white`}
          >
            Review Snapshot
          </h4>
          <p className="text-gray-400 font-mono text-sm mt-2">
            Comparing recent/top customer reviews from your listing and competitors.
          </p>
        </div>

        <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-mono">
          {yourReviews.length + totalCompetitorReviews} Reviews Parsed
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ReviewCardGroup
          title="Your Product Reviews"
          asin={yourProduct?.asin}
          reviews={yourReviews}
          highlight
        />

        <div className="space-y-6">
          {competitors.map((competitor, index) => (
            <ReviewCardGroup
              key={competitor.asin || index}
              title={`Competitor #${index + 1} Reviews`}
              asin={competitor.asin}
              reviews={competitor.reviews || []}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCardGroup({ title, asin, reviews, highlight = false }) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        highlight
          ? "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100"
          : "bg-white border border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h5 className="text-xl font-black text-gray-950">{title}</h5>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Showing up to 10 reviews
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-100 text-purple-700">
          {asin || "N/A"}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-gray-500 font-mono text-sm leading-6">
            No visible top reviews were available in the HTML returned by Amazon for this ASIN.
            </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 review-scrollbar">
          {reviews.slice(0, 10).map((review, index) => (
            <ReviewItem key={index} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewItem({ review }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="font-bold text-gray-950 leading-snug">
          {review.title || "Review"}
        </p>

        <span className="shrink-0 text-xs font-black text-orange-600 bg-orange-50 border border-orange-100 px-2 py-1 rounded-full">
          {review.rating || "N/A"} ⭐
        </span>
      </div>

      <p className="text-sm text-gray-700 leading-6">
        {review.body || "No review body found."}
      </p>

      <div className="flex items-center justify-between gap-3 mt-3">
        {review.date ? (
          <p className="text-xs text-gray-400 font-mono">{review.date}</p>
        ) : (
          <span />
        )}

        {review.verified && (
          <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full">
            Verified
          </span>
        )}
      </div>
      
    </div>
  );
}