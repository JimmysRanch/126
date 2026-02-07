const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4242";

async function parseErrorResponse(res: Response, operation: string): Promise<string> {
  try {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (json.error && typeof json.error === 'string') return json.error;
      if (json.error?.message) return json.error.message;
      if (json.message) return json.message;
    } catch {
      // Not JSON, use text directly
    }
    return text || `${operation} failed with status ${res.status}`;
  } catch {
    return `${operation} failed with status ${res.status}`;
  }
}

export async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorMsg = await parseErrorResponse(res, `POST ${path}`);
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) {
    const errorMsg = await parseErrorResponse(res, `GET ${path}`);
    throw new Error(errorMsg);
  }
  return res.json();
}
