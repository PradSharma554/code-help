"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import CodeEditor from "./CodeEditor";
import AnalyzerSidebar from "./AnalyzerSidebar";
import AnalysisResult from "./AnalysisResult";
import HintModal from "./HintModal";
import SolutionModal from "./SolutionModal";
import { useAnalyzeComplexity, useAssistant } from "../../hooks/useAnalyzer";

export default function AnalyzerContainer() {
  const { data: session, status } = useSession();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState(null);

  const [hint, setHint] = useState(null);
  const [solutions, setSolutions] = useState({}); // Stores solutions by language
  const [assistType, setAssistType] = useState(null); // 'hint' or 'solution'

  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [solutionLanguage, setSolutionLanguage] = useState("javascript");
  const [lastAnalyzedCode, setLastAnalyzedCode] = useState("");

  const analyzeMutation = useAnalyzeComplexity();
  const assistantMutation = useAssistant();

  // Persistence: Load on Mount (User Specific)
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      // Clear state on logout
      setCode("");
      setLastAnalyzedCode("");
      setResult(null);
      setHint(null);
      setSolutions({});
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      const prefix = `analyzer_${session.user.email}`;

      const savedCode = localStorage.getItem(`${prefix}_code`);
      const savedLang = localStorage.getItem(`${prefix}_lang`);
      const savedResult = localStorage.getItem(`${prefix}_result`);
      const savedHint = localStorage.getItem(`${prefix}_hint`);
      const savedSolutions = localStorage.getItem(`${prefix}_solutions`);
      const savedSolLang = localStorage.getItem(`${prefix}_sol_lang`);

      if (savedCode) {
        setCode(savedCode);
        setLastAnalyzedCode(savedCode);
      }
      if (savedLang) setLanguage(savedLang);
      if (savedResult) setResult(JSON.parse(savedResult));
      if (savedHint) setHint(savedHint);
      if (savedSolutions) setSolutions(JSON.parse(savedSolutions));
      if (savedSolLang) setSolutionLanguage(savedSolLang);
    }
  }, [status, session]);

  // Persistence: Save on Change (User Specific)
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const prefix = `analyzer_${session.user.email}`;

    localStorage.setItem(`${prefix}_code`, code);
    localStorage.setItem(`${prefix}_lang`, language);

    if (result)
      localStorage.setItem(`${prefix}_result`, JSON.stringify(result));
    else localStorage.removeItem(`${prefix}_result`);

    if (hint) localStorage.setItem(`${prefix}_hint`, hint);
    else localStorage.removeItem(`${prefix}_hint`);

    if (Object.keys(solutions).length > 0)
      localStorage.setItem(`${prefix}_solutions`, JSON.stringify(solutions));
    else localStorage.removeItem(`${prefix}_solutions`);

    if (solutionLanguage)
      localStorage.setItem(`${prefix}_sol_lang`, solutionLanguage);
  }, [
    code,
    language,
    result,
    hint,
    solutions,
    solutionLanguage,
    status,
    session,
  ]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const checkAndResetStaleData = () => {
    if (code !== lastAnalyzedCode) {
      setResult(null);
      setHint(null);
      setSolutions({});
      setShowSolutionModal(false);
    }
  };

  const handleAnalyze = () => {
    if (!code.trim()) return;
    checkAndResetStaleData();
    setResult(null);

    analyzeMutation.mutate(
      { code, language },
      {
        onSuccess: (data) => {
          setResult(data);
          setLastAnalyzedCode(code);
        },
      },
    );
  };

  const handleGetHint = () => {
    if (!code.trim()) return;
    checkAndResetStaleData();

    if (hint && code === lastAnalyzedCode) {
      setShowHintModal(true);
      return;
    }

    setAssistType("hint");
    assistantMutation.mutate(
      { code, language, type: "hint", previousHints: [] },
      {
        onSuccess: (data) => {
          if (data.result) {
            setHint(data.result);
            setLastAnalyzedCode(code);
            setShowHintModal(true);
          }
        },
        onSettled: () => setAssistType(null),
      },
    );
  };

  const handleGetSolution = (lang = language) => {
    if (!code.trim()) return;

    if (code !== lastAnalyzedCode) {
      checkAndResetStaleData();
    } else {
      if (solutions[lang]) {
        setSolutionLanguage(lang);
        setShowSolutionModal(true);
        return;
      }
    }

    setAssistType("solution");
    setSolutionLanguage(lang);
    assistantMutation.mutate(
      { code, language: lang, type: "solution" },
      {
        onSuccess: (data) => {
          if (data.result) {
            setSolutions((prev) => ({ ...prev, [lang]: data.result }));
            setShowSolutionModal(true);
            setLastAnalyzedCode(code);
          }
        },
        onSettled: () => setAssistType(null),
      },
    );
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto min-h-[80vh] flex flex-col md:flex-row gap-6 relative">
      {/* Input Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">
            Code Complexity Analyzer
          </h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="flex flex-row gap-4 grow min-h-[500px]">
          <AnalyzerSidebar
            onAnalyze={handleAnalyze}
            onGetHint={handleGetHint}
            onGetSolution={handleGetSolution}
            loading={analyzeMutation.isPending}
            assistLoading={assistantMutation.isPending ? assistType : null}
            code={code}
            language={language}
          />

          <CodeEditor
            code={code}
            language={language}
            onChange={handleCodeChange}
          />
        </div>
      </div>

      {/* Output Section */}
      <div className="md:w-1/3 flex flex-col gap-4 h-[85vh] overflow-y-auto pb-4 pr-1">
        <AnalysisResult result={result} />
      </div>

      <HintModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        hint={hint}
      />

      <SolutionModal
        isOpen={showSolutionModal}
        onClose={() => setShowSolutionModal(false)}
        solution={solutions[solutionLanguage]}
        language={solutionLanguage}
        onLanguageChange={(lang) => handleGetSolution(lang)}
        isLoading={assistantMutation.isPending}
      />
    </div>
  );
}
