import Reports from "@/app/components/Reports/Reports";
import SessionManager from "@/app/components/SessionManager";

export default function Recruitment() {
  return (
    <SessionManager>
      <Reports />
    </SessionManager>
  );
}
