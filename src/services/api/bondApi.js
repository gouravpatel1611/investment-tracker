const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3001/api/bonds"
  : "/api/bonds";

export async function findBondByIsin(isin) {
  const cleanIsin = String(isin || "")
    .trim()
    .toUpperCase();

  if (!cleanIsin) {
    throw new Error("ISIN is required");
  }

  const response = await fetch(
    `${API_BASE_URL}/${cleanIsin}`
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.error || "Bond not found"
    );
  }

  return data.data;
}