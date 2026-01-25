import { Target, ExternalLink } from "lucide-react";

export default function SuggestedProblems({ problems }) {
  if (!problems || problems.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2 flex items-center gap-2">
        <Target className="w-5 h-5 text-indigo-500" />
        Recommended Practice
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-indigo-50/50">
            <tr className="text-slate-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Problem</th>
              <th className="px-4 py-3 font-medium">Topic</th>
              <th className="px-4 py-3 font-medium">Difficulty</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {problems.map((prob, idx) => (
              <tr key={idx} className="hover:bg-indigo-50/30 transition">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {prob.problemName}
                </td>
                <td className="px-4 py-3 text-slate-500">{prob.topic}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      prob.difficulty === "Hard"
                        ? "bg-red-50 text-red-600"
                        : prob.difficulty === "Medium"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-green-50 text-green-600"
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={prob.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 text-xs font-semibold"
                  >
                    Solve <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
