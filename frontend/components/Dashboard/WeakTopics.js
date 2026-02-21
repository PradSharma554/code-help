import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeakTopics({ topicStats }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2">
        Weak Topics
      </h3>
      <div
        className="w-full"
        style={{
          height: Math.max(300, (topicStats?.length || 0) * 50),
        }}
      >
        {topicStats && topicStats.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topicStats}
              layout="vertical"
              margin={{ left: 0, right: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e2e8f0"
              />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="_id"
                width={150}
                tick={{ fontSize: 12, fill: "#64748b" }}
                interval={0}
                tickFormatter={(value) =>
                  value.length > 20 ? `${value.substring(0, 20)}...` : value
                }
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#6366f1"
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
            No data logged yet
          </div>
        )}
      </div>
    </div>
  );
}
