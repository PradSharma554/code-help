import { Lightbulb, X } from "lucide-react";

export default function HintModal({ isOpen, onClose, hint }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95">
        <div className="p-4 border-b flex justify-between items-center bg-amber-50 rounded-t-xl">
          <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Helpful Hint
          </h2>
          <button
            onClick={onClose}
            className="text-amber-800/50 hover:text-amber-900 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 text-slate-700 text-lg leading-relaxed font-medium">
          {hint}
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-200 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
