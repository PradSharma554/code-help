import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function LeetCodeProgress({ leetcodeStats }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full flex justify-between items-center mb-2 border-b pb-2">
        <h3 className="font-semibold text-slate-700">LeetCode Progress</h3>
        <span className="text-xs text-slate-400">
          Total: {leetcodeStats?.totalSolved || 0}
        </span>
      </div>

      {leetcodeStats ? (
        <div className="relative w-full h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Easy",
                    value: leetcodeStats.easySolved || 0,
                    fill: "#10b981",
                  },
                  {
                    name: "Medium",
                    value: leetcodeStats.mediumSolved || 0,
                    fill: "#f59e0b",
                  },
                  {
                    name: "Hard",
                    value: leetcodeStats.hardSolved || 0,
                    fill: "#ef4444",
                  },
                ]}
                innerRadius={60}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                cornerRadius={5}
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-800">
              {leetcodeStats.totalSolved}
            </span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Solved
            </span>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-slate-400 text-sm italic">
          Sync LeetCode to see stats
        </div>
      )}

      {leetcodeStats && (
        <div className="w-full grid grid-cols-3 gap-2 mt-2 text-center">
          <div className="bg-emerald-50 rounded-lg p-2">
            <div className="text-emerald-600 font-bold text-lg">
              {leetcodeStats.easySolved}
            </div>
            <div className="text-emerald-700/60 text-[10px] uppercase font-bold">
              Easy
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-2">
            <div className="text-amber-600 font-bold text-lg">
              {leetcodeStats.mediumSolved}
            </div>
            <div className="text-amber-700/60 text-[10px] uppercase font-bold">
              Med
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-2">
            <div className="text-red-600 font-bold text-lg">
              {leetcodeStats.hardSolved}
            </div>
            <div className="text-red-700/60 text-[10px] uppercase font-bold">
              Hard
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
