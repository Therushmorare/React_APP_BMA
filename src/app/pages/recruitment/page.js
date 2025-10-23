import JobPosts from "@/app/components/Recruitment/RecruitmentPage";
import SessionManager from "@/app/components/SessionManager";

export default function Recruitment() {
  return (
    <SessionManager>
      <JobPosts />
    </SessionManager>
  );
}
