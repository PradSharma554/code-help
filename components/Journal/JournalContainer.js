"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMistakes, useCreateMistake } from "../../hooks/useJournal";
import JournalHeader from "./JournalHeader";
import JournalForm from "./JournalForm";
import SearchBar from "./SearchBar";
import MistakeList from "./MistakeList";

export default function JournalContainer() {
  const { data: session } = useSession();
  const router = useRouter(); // Kept if needed later, though used mainly for redirects before

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");

  const { data: mistakes = [], isLoading, isError, error } = useMistakes();
  const createMistake = useCreateMistake();

  const handleCreate = (data) => {
    createMistake.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const filteredMistakes = mistakes.filter(
    (m) =>
      m.problemName.toLowerCase().includes(filter.toLowerCase()) ||
      m.topic.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="max-w-8xl mx-auto relative">
      <JournalHeader
        showForm={showForm}
        toggleForm={() => setShowForm(!showForm)}
      />

      {showForm && (
        <JournalForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <SearchBar filter={filter} setFilter={setFilter} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl border border-red-100">
          Error loading mistakes: {error.message}
        </div>
      ) : (
        <MistakeList mistakes={filteredMistakes} />
      )}
    </div>
  );
}
