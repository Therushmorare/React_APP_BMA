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
