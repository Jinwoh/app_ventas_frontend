export const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiGet(path) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data.detail ? ` - ${data.detail}` : "";
    } catch (_) {}
    throw new Error(`HTTP ${res.status} ${res.statusText}${detail}`);
  }

  return res.json();
}
