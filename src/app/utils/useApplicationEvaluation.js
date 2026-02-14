import { useEffect, useState } from "react";
import { calculateTotalScore, getPerformanceLevel } from "./applicationQuizData";

const BASE_URL = "https://jellyfish-app-z83s2.ondigitalocean.app";

export const useApplicationEvaluation = (applicantId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!applicantId) return;

    const fetchData = async () => {
      try {
        //Get applications
        const appRes = await fetch(
          `${BASE_URL}/api/candidate/myApplications/${applicantId}`
        );
        const appData = await appRes.json();

        const enrichedApps = await Promise.all(
          appData.applications.map(async (app) => {

            //Get HR questions + responses
            const qRes = await fetch(
              `${BASE_URL}/api/hr/applicationQuestions/${app.job_id}/${applicantId}`
            );
            const questions = await qRes.json();

            //Get backend score
            const scoreRes = await fetch(
              `${BASE_URL}/api/hr/applicationScore/${app.job_id}/${applicantId}`
            );
            const backendScore = await scoreRes.json();

            //Convert backend responses → local format
            const formattedAnswers = questions.map((q, index) => ({
              questionId: index + 1,
              selectedOptionId: mapResponseToOption(q.response)
            }));

            const mcScore = calculateTotalScore(formattedAnswers);
            const performance = getPerformanceLevel(mcScore);

            return {
              ...app,
              questions,
              backendScore,
              mcScore,
              performance
            };
          })
        );

        setApplications(enrichedApps);

      } catch (err) {
        console.error(err);
        setError("Failed to load application data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicantId]);

  return { applications, loading, error };
};

/*Convert Yes/No → option id */
const mapResponseToOption = (response) => {
  if (!response) return null;

  const lower = response.toLowerCase();

  if (lower.includes("yes")) return "a";
  if (lower.includes("no")) return "d";

  return "b"; // default neutral
};
