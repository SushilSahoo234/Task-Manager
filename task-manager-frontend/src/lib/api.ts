const BASE_URL = "http://localhost:5000";

export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
};