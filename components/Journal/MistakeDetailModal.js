import {
  X,
  Calendar,
  Code,
  AlertTriangle,
  Layers,
  Edit2,
  Check,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useUpdateMistake } from "../../hooks/useJournal";

export default function MistakeDetailModal({ isOpen, onClose, mistake }) {
  const [isEditing, setIsEditing] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const updateMistake = useUpdateMistake();

  useEffect(() => {
    if (mistake) {
      setReflectionText(mistake.reflection);
      setIsEditing(false);
    }
  }, [mistake]);

  const handleSave = () => {
    updateMistake.mutate(
      { id: mistake._id, reflection: reflectionText },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  if (!isOpen || !mistake) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 flex justify-between items-start bg-slate-50 rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {mistake.problemName}
            </h2>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-white border text-slate-600 text-xs rounded-full font-medium shadow-sm">
                {mistake.platform}
              </span>
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                {mistake.topic}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-200 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* Mistake Type */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Mistake Type
              </div>
              <div
                className={clsx(
                  "text-sm font-bold mt-0.5 inline-block px-2 py-0.5 rounded",
                  {
                    "bg-red-50 text-red-700":
                      mistake.mistakeType === "Wrong Approach" ||
                      mistake.mistakeType === "Logic Bug",
                    "bg-yellow-50 text-yellow-700":
                      mistake.mistakeType === "TLE",
                    "bg-orange-50 text-orange-700":
                      mistake.mistakeType === "Edge Case",
                    "bg-slate-100 text-slate-600":
                      mistake.mistakeType === "Other",
                  },
                )}
              >
                {mistake.mistakeType}
              </div>
            </div>
          </div>

          {/* Reflection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4" /> Reflection
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-500 hover:text-slate-600 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateMistake.isPending}
                    className="text-emerald-600 hover:text-emerald-700 text-xs font-medium flex items-center gap-1 disabled:opacity-50"
                  >
                    {updateMistake.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 leading-relaxed"
                rows={4}
              />
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 leading-relaxed italic">
                "{mistake.reflection}"
              </div>
            )}
          </div>

          {/* Code Snippet */}
          {mistake.codeSnippet &&
            mistake.codeSnippet.trim() !== "" &&
            !/^Language:\s*\w+$/.test(mistake.codeSnippet.trim()) && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" /> Code Snippet
                </h3>
                <div className="bg-[#1d1f21] p-4 rounded-xl overflow-x-auto text-sm text-[#f8f8f2] font-mono whitespace-pre custom-scrollbar">
                  {mistake.codeSnippet}
                </div>
              </div>
            )}

          {/* Complexity Analysis */}
          {mistake.complexityAnalysis && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <div className="text-xs text-indigo-500 font-semibold mb-1">
                  Time Complexity
                </div>
                <div className="font-mono font-bold text-indigo-900">
                  {mistake.complexityAnalysis.time || "N/A"}
                </div>
              </div>
              <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-xl">
                <div className="text-xs text-pink-500 font-semibold mb-1">
                  Space Complexity
                </div>
                <div className="font-mono font-bold text-pink-900">
                  {mistake.complexityAnalysis.space || "N/A"}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar className="w-4 h-4" />
              Created on {new Date(
                mistake.createdAt,
              ).toLocaleDateString()} at{" "}
              {new Date(mistake.createdAt).toLocaleTimeString()}
            </div>
            <button
              onClick={onClose}
              className="px-4 cursor-pointer py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
}
