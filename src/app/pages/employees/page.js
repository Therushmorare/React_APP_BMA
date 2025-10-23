import EmployeesPage from "@/app/components/Employees/EmployeesPage";
import SessionManager from "@/app/components/SessionManager";

export default function Employees() {
  return (
    <SessionManager>
      <EmployeesPage />
    </SessionManager>
  );
}