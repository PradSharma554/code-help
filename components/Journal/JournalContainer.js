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
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

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

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto relative">
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
