export default function RecentLogs({ recentMistakes }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2">
        Recent Logs
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500 uppercase text-xs tracking-wider">
              <th className="pb-3 font-medium px-4">Problem</th>
              <th className="pb-3 font-medium px-4">Topic</th>
              <th className="pb-3 font-medium px-4">Mistake</th>
              <th className="pb-3 font-medium px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentMistakes && recentMistakes.length > 0 ? (
              recentMistakes.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {log.problemName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-semibold text-slate-600 border border-slate-200">
                      {log.topic}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        log.mistakeType === "TLE"
                          ? "bg-yellow-100 text-yellow-700"
                          : log.mistakeType === "Wrong Approach"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {log.mistakeType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 font-mono text-xs">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-12 text-center text-slate-400 italic"
                >
                  No logs found. Start your journey today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
