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
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");

  const { data: mistakes = [], isLoading } = useMistakes();
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

  if (!session) return null; // Or loading spinner while redirecting

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
      ) : (
        <MistakeList mistakes={filteredMistakes} />
      )}
    </div>
  );
}
