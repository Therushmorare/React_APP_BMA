export async function apiLogin({ email, password }) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return res.json(); // should return token or user data
}

export async function fetchAllApplicants() {
  const res = await fetch("https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/all_applicants", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // ensures fresh data every time
  });

  if (!res.ok) {
    throw new Error("Failed to fetch applicants");
  }

  return res.json();
}

export async function fetchPersonalInfo(applicantId) {
  console.log("Attempting to fetch personal info for:", applicantId); // 🔥
  const res = await fetch(
    `https://jellyfish-app-z83s2.ondigitalocean.app/api/candidate/personalInfo/${applicantId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch personal info for ${applicantId}`);
  }

  const data = await res.json();
  console.log("Received data:", data); // 🔥
  return data;
}

export async function fetchEducation(applicantId) {
  console.log("Attempting to fetch education info for:", applicantId); // 🔥
  const res = await fetch(
    `https://jellyfish-app-z83s2.ondigitalocean.app/api/candidate/myEducation/${applicantId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch education info for ${applicantId}`);
  }

  const data = await res.json();
  console.log("Received data:", data); // 🔥
  return data;
}

export async function fetchExperience(applicantId) {
  console.log("Attempting to fetch experience info for:", applicantId); // 🔥
  const res = await fetch(
    `https://jellyfish-app-z83s2.ondigitalocean.app/api/candidate/myExperience/${applicantId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch experience info for ${applicantId}`);
  }

  const data = await res.json();
  console.log("Received data:", data); // 🔥
  return data;
}

export async function fetchSkills(applicantId) {
  console.log("Attempting to fetch skill info for:", applicantId); // 🔥
  const res = await fetch(
    `https://jellyfish-app-z83s2.ondigitalocean.app/api/candidate/mySkills/${applicantId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch skills info for ${applicantId}`);
  }

  const data = await res.json();
  console.log("Received data:", data); // 🔥
  return data;
}

export async function fetchQuestions(jobId, applicantId) {
  const res = await fetch(
    `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/applicationQuestions/${jobId}/${applicantId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch Job Questions for ${applicantId}`);
  }

  return res.json();
}

export async function fetchApplicationScore(jobId, applicantId) {
  if (!jobId || !applicantId) throw new Error("Missing jobId or applicantId");

  const res = await fetch(`https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/applicationScore/${jobId}/${applicantId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Application Score for ${applicantId}`);
  }

  return res.json();
}
