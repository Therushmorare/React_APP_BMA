import CandidatesPage from "@/app/components/Candidates/CandidatesPage";
import SessionManager from "@/app/components/SessionManager";

export default function Candidates() {
  return (
    <SessionManager>
      <CandidatesPage />
    </SessionManager>
  );
}
