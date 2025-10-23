import Interviews from "@/app/components/Interviews/InterviewsPage";
import SessionManager from "@/app/components/SessionManager";

export default function Employees() {
  return (
    <SessionManager>
      <Interviews />
    </SessionManager>
  );
}