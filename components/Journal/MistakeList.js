import MistakeCard from "./MistakeCard";

export default function MistakeList({ mistakes }) {
  if (!mistakes || mistakes.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
        No entries found. Start logging your grind!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mistakes.map((mistake) => (
        <MistakeCard key={mistake._id} mistake={mistake} />
      ))}
    </div>
  );
}
