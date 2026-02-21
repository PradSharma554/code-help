import AnalyzerContainer from "../../components/Analyzer/AnalyzerContainer";
import AuthGuard from "../../components/Auth/AuthGuard";

export default function AnalyzerPage() {
  return (
    <AuthGuard>
      <AnalyzerContainer />
    </AuthGuard>
  );
}
