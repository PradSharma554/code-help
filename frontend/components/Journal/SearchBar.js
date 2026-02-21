import { Search } from "lucide-react";

export default function SearchBar({ filter, setFilter }) {
  return (
    <div className="mb-6 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
      <input
        type="text"
        placeholder="Search by problem or topic..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
}
