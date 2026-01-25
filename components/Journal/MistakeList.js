import Table from "../Common/Table/Table";
import clsx from "clsx";
import { Eye } from "lucide-react";
import { useState } from "react";
import MistakeDetailModal from "./MistakeDetailModal";
import TruncatedText from "../Common/TruncatedText";

export default function MistakeList({ mistakes }) {
  const [selectedMistakeId, setSelectedMistakeId] = useState(null);

  const selectedMistake = mistakes.find((m) => m._id === selectedMistakeId);

  const columns = [
    {
      header: "Problem",
      key: "problemName",
      render: (row) => (
        <div>
          <TruncatedText>
            <div className="font-bold my-3 line-clamp-1 text-slate-900">
              {row.problemName}
            </div>
          </TruncatedText>
          {row.complexityAnalysis?.time && (
            <div className="text-xs text-slate-400 font-mono mt-1">
              TC: {row.complexityAnalysis.time}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Platform",
      key: "platform",
      render: (row) => (
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full border">
          {row.platform}
        </span>
      ),
    },
    {
      header: "Topic",
      key: "topic",
      render: (row) => (
        <span className="px-2 py-0.5 w-max line-clamp-1 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100">
          <TruncatedText limit={10}>{row.topic}</TruncatedText>
        </span>
      ),
    },
    {
      header: "Mistake Type",
      key: "mistakeType",
      render: (row) => (
        <span
          className={clsx(
            "text-xs font-semibold px-2 w-max py-1 rounded inline-block",
            {
              "bg-red-50 text-red-700":
                row.mistakeType === "Wrong Approach" ||
                row.mistakeType === "Logic Bug",
              "bg-yellow-50 text-yellow-700": row.mistakeType === "TLE",
              "bg-orange-50 text-orange-700": row.mistakeType === "Edge Case",
              "bg-slate-100 text-slate-600": row.mistakeType === "Other",
            },
          )}
        >
          {row.mistakeType}
        </span>
      ),
    },
    {
      header: "Reflection",
      key: "reflection",
      render: (row) => (
        <div className="max-w-xs truncate text-slate-600 italic border-l-2 border-indigo-200 pl-2">
          "{row.reflection}"
        </div>
      ),
    },
    {
      header: "Date",
      key: "createdAt",
      render: (row) => (
        <span className="text-xs text-slate-400">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      width: "80px",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMistakeId(row._id);
          }}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
          title="View Details"
        >
          <Eye className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={mistakes}
        pagination={true}
        pageSize={10}
      />
      <MistakeDetailModal
        isOpen={!!selectedMistakeId}
        onClose={() => setSelectedMistakeId(null)}
        mistake={selectedMistake}
      />
    </>
  );
}
