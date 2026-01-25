"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryState, parseAsInteger } from "nuqs";
import { useMistakes, useCreateMistake } from "../../hooks/useJournal";
import JournalHeader from "./JournalHeader";
import JournalForm from "./JournalForm";
import SearchBar from "./SearchBar";
import MistakeList from "./MistakeList";

export default function JournalContainer() {
  const { data: session } = useSession();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    throttleMs: 500,
  });
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));

  // Fetch data with server-side params
  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useMistakes({ page, pageSize, search });

  const mistakes = responseData?.mistakes || [];
  const totalCount = responseData?.totalCount || 0;

  const createMistake = useCreateMistake();

  const handleCreate = (data) => {
    createMistake.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

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

      <SearchBar filter={search} setFilter={setSearch} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl border border-red-100">
          Error loading mistakes: {error.message}
        </div>
      ) : (
        <MistakeList
          mistakes={mistakes}
          totalCount={totalCount}
          serverSide={true}
        />
      )}
    </div>
  );
}
