"use client";

export default function AnalysisMarkdown({ text }) {
  const blocks = parseAnalysisText(text);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.type === "intro") {
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <p className="text-gray-700 leading-8 text-base md:text-lg">
                {renderInlineMarkdown(block.content)}
              </p>
            </div>
          );
        }

        if (block.type === "section") {
          return (
            <article
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-black">
                    {index}
                  </div>
                  <div>
                    <p className="text-xs text-white/70 font-mono uppercase tracking-wider">
                      Recommendation Section
                    </p>
                    <h5 className="text-2xl md:text-3xl font-black text-white">
                      {block.title}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <MarkdownContent items={block.items} />
              </div>
            </article>
          );
        }

        return null;
      })}
    </div>
  );
}

function MarkdownContent({ items }) {
  const elements = [];
  let tableBuffer = [];

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      elements.push({
        type: "table",
        rows: tableBuffer,
      });
      tableBuffer = [];
    }
  };

  items.forEach((line) => {
    const trimmed = line.trim();

    if (isMarkdownTableLine(trimmed)) {
      tableBuffer.push(trimmed);
      return;
    }

    flushTable();

    elements.push({
      type: "line",
      content: line,
    });
  });

  flushTable();

  return (
    <>
      {elements.map((element, index) => {
        if (element.type === "table") {
          return <MarkdownTable key={index} rows={element.rows} />;
        }

        return <MarkdownLine key={index} line={element.content} />;
      })}
    </>
  );
}

function MarkdownTable({ rows }) {
  const cleanRows = rows
    .filter((row) => row.trim())
    .filter((row) => !isMarkdownTableSeparator(row))
    .map((row) =>
      row
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean)
    );

  if (cleanRows.length === 0) return null;

  const headers = cleanRows[0];
  const bodyRows = cleanRows.slice(1);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-5 py-4 text-left text-sm font-black text-white uppercase tracking-wide"
                >
                  {renderInlineMarkdown(header)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-100 last:border-b-0 hover:bg-purple-50/60 transition-colors"
              >
                {headers.map((_, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-5 py-4 align-top text-sm leading-7 text-gray-700"
                  >
                    {cellIndex === 0 ? (
                      <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-800 border border-purple-200">
                        {renderInlineMarkdown(row[cellIndex] || "")}
                      </span>
                    ) : (
                      renderInlineMarkdown(row[cellIndex] || "")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MarkdownLine({ line }) {
  const trimmed = line.trim();

  if (!trimmed) return null;

  if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
    return (
      <div className="flex items-center gap-4 py-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
          {/* Section Break */}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
    );
  }

  const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

  if (numberedMatch) {
    return (
      <div className="flex gap-4 p-4 bg-purple-50 border border-purple-100 rounded-2xl">
        <div className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
          {numberedMatch[1]}
        </div>
        <p className="text-gray-800 leading-7">
          {renderInlineMarkdown(numberedMatch[2])}
        </p>
      </div>
    );
  }

  if (trimmed.startsWith("- ")) {
    return (
      <div className="flex gap-3 items-start">
        <span className="mt-2 w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
        <p className="text-gray-700 leading-7">
          {renderInlineMarkdown(trimmed.replace("- ", ""))}
        </p>
      </div>
    );
  }

  if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
    return (
      <h6 className="text-xl font-extrabold text-gray-950 mt-6">
        {trimmed.replaceAll("**", "")}
      </h6>
    );
  }

  if (trimmed.includes("**Recommendation:**")) {
    return (
      <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
        <p className="text-blue-950 leading-7">
          {renderInlineMarkdown(trimmed)}
        </p>
      </div>
    );
  }

  if (trimmed.includes("**Current Issue:**")) {
    return (
      <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl">
        <p className="text-orange-950 leading-7">
          {renderInlineMarkdown(trimmed)}
        </p>
      </div>
    );
  }

  if (trimmed.includes("**Verdict:**")) {
    return (
      <div className="p-5 bg-green-50 border border-green-100 rounded-2xl">
        <p className="text-green-950 leading-7">
          {renderInlineMarkdown(trimmed)}
        </p>
      </div>
    );
  }

  if (trimmed.startsWith("**New Title:**")) {
    const titleText = trimmed.replace("**New Title:**", "").trim();

    return (
      <div className="p-5 bg-gray-950 text-white rounded-2xl">
        <p className="text-xs uppercase tracking-wider font-mono text-gray-400 mb-2">
          Suggested Title
        </p>
        <p className="text-lg leading-8 font-semibold">
          {renderInlineMarkdown(titleText)}
        </p>
      </div>
    );
  }

  return (
    <p className="text-gray-700 leading-8 text-base">
      {renderInlineMarkdown(trimmed)}
    </p>
  );
}

function parseAnalysisText(text) {
  if (!text) return [];

  const lines = text.split("\n");
  const blocks = [];
  let currentSection = null;
  let introLines = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      if (introLines.length > 0) {
        blocks.push({
          type: "intro",
          content: introLines.join(" "),
        });
        introLines = [];
      }

      if (currentSection) {
        blocks.push(currentSection);
      }

      currentSection = {
        type: "section",
        title: trimmed.replace("## ", "").trim(),
        items: [],
      };

      return;
    }

    if (currentSection) {
      currentSection.items.push(line);
    } else if (trimmed) {
      introLines.push(trimmed);
    }
  });

  if (currentSection) {
    blocks.push(currentSection);
  }

  if (introLines.length > 0) {
    blocks.unshift({
      type: "intro",
      content: introLines.join(" "),
    });
  }

  return blocks;
}

function renderInlineMarkdown(text) {
  if (!text) return null;

  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-extrabold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-2 py-1 rounded-md bg-gray-100 text-purple-700 font-mono text-sm"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function isMarkdownTableLine(line) {
  if (!line) return false;
  return line.startsWith("|") && line.endsWith("|");
}

function isMarkdownTableSeparator(line) {
  if (!line) return false;
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);
}