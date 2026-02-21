import JournalContainer from "../../components/Journal/JournalContainer";
import AuthGuard from "../../components/Auth/AuthGuard";

export default function JournalPage() {
  return (
    <AuthGuard>
      <JournalContainer />
    </AuthGuard>
  );
}
