export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.zirelly.az/api";

export async function apiFetch(path, { lang, ...options } = {}) {
  const url = new URL(`${API_URL}${path}`);

  if (lang) {
    url.searchParams.set("lang", lang);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}
