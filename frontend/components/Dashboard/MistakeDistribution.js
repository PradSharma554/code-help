import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4f46e5", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

export default function MistakeDistribution({ mistakeTypeStats }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2">
        Mistake Distribution
      </h3>
      <div className="h-64">
        {mistakeTypeStats && mistakeTypeStats.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mistakeTypeStats}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="_id"
              >
                {mistakeTypeStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ color: "#1e293b" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
            No data logged yet
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {mistakeTypeStats &&
          mistakeTypeStats.map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 px-2 py-1 rounded-full border"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: COLORS[index % COLORS.length] }}
              ></span>
              {entry._id}
            </div>
          ))}
      </div>
    </div>
  );
}
