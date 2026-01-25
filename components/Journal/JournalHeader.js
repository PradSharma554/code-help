import { Plus, X } from "lucide-react";

export default function JournalHeader({ showForm, toggleForm }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mistake Journal</h1>
        <p className="text-slate-500 mt-1">
          Reflect on your errors to stop making them.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={toggleForm}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Log Mistake"}
        </button>
      </div>
    </div>
  );
}
