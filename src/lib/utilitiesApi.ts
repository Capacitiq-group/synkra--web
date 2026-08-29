// Base URL for synkra-utilities' FastAPI backend. Called directly from the
// browser (no server-side proxy) - the utilities API's own CORS_ORIGINS
// config is what authorizes this, see synkra-utilities/.env.example.
export function utilitiesApiUrl(path: string): string {
  const base = (
    (import.meta.env?.["VITE_UTILITIES_API_URL"] as string | undefined) ?? ""
  ).replace(/\/+$/, "");
  if (!base) {
    console.warn(
      "[Synkra] VITE_UTILITIES_API_URL is not set. Utility pages will not work until it is.",
    );
  }
  return `${base}/api/v1${path}`;
}

export class UtilitiesApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** POSTs JSON, expects a binary (image/file) response back as a Blob. */
export async function postForBlob(path: string, body: unknown): Promise<Blob> {
  const res = await fetch(utilitiesApiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) message = typeof data.detail === "string" ? data.detail : message;
    } catch {
      // response wasn't JSON - keep the generic message
    }
    throw new UtilitiesApiError(message, res.status);
  }
  return res.blob();
}
