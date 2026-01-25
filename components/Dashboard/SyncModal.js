import { X, Loader2, DownloadCloud } from "lucide-react";
import { useState, useEffect } from "react";

export default function SyncModal({
  isOpen,
  onClose,
  onSync,
  isSyncing,
  initialUsername,
}) {
  const [username, setUsername] = useState(initialUsername || "");

  useEffect(() => {
    setUsername(initialUsername || "");
  }, [initialUsername, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            Sync from LeetCode
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Enter your LeetCode username to fetch recent failed submissions and
          update your progress stats.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. tmwilliamlin168"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSync(username)}
            disabled={isSyncing || !username.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-70"
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <DownloadCloud className="w-4 h-4" />
            )}
            {isSyncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
