import clsx from "clsx";

export default function MistakeCard({ mistake }) {
  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {mistake.problemName}
          </h3>
          <div className="flex gap-2 mt-1">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full border">
              {mistake.platform}
            </span>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100">
              {mistake.topic}
            </span>
          </div>
        </div>
        <span
          className={clsx("text-xs font-semibold px-2 py-1 rounded", {
            "bg-red-50 text-red-700":
              mistake.mistakeType === "Wrong Approach" ||
              mistake.mistakeType === "Logic Bug",
            "bg-yellow-50 text-yellow-700": mistake.mistakeType === "TLE",
            "bg-orange-50 text-orange-700": mistake.mistakeType === "Edge Case",
            "bg-slate-100 text-slate-600": mistake.mistakeType === "Other",
          })}
        >
          {mistake.mistakeType}
        </span>
      </div>

      {mistake.complexityAnalysis && mistake.complexityAnalysis.time && (
        <div className="mb-3 flex gap-4 text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
          <span>TC: {mistake.complexityAnalysis.time}</span>
          <span>SC: {mistake.complexityAnalysis.space}</span>
        </div>
      )}

      <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-400 italic">
        "{mistake.reflection}"
      </p>
      <div className="mt-3 text-xs text-slate-400 flex justify-end">
        {new Date(mistake.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
