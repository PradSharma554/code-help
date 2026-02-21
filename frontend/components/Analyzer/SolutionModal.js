import { Unlock, X, Loader2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SolutionModal({
  isOpen,
  onClose,
  solution,
  language,
  onLanguageChange,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col h-[85vh] animate-in zoom-in-95">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Unlock className="w-5 h-5 text-emerald-600" />
              Optimal Solution
            </h2>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 relative bg-[#1d1f21] min-h-0 w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          <div
            className="absolute inset-0 overflow-auto custom-scrollbar overscroll-contain"
            onWheel={(e) => e.stopPropagation()}
          >
            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={atomDark}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                minHeight: "100%",
                fontSize: "0.9rem",
                lineHeight: "1.5",
                background: "transparent",
              }}
              showLineNumbers={true}
              wrapLines={true}
            >
              {solution || ""}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={() => {
              if (solution) navigator.clipboard.writeText(solution);
            }}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition flex items-center gap-1"
          >
            Copy Code
          </button>
        </div>
      </div>
    </div>
  );
}
