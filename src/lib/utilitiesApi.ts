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

/**
 * Uploads a file as multipart/form-data, expects a binary response back.
 * `query` becomes URL query params (e.g. ?quality=75). `extraFields`
 * becomes additional multipart fields alongside `file` - JSON-serializes
 * any non-string value, since that's what a Form(JSON string) backend
 * field expects (see csv_clean.py's `options` field).
 * Returns both the blob and the response headers, since several tools
 * (compress, csv-clean) return useful metadata via X-* headers rather
 * than in the body.
 */
export async function postFileForBlob(
  path: string,
  file: File,
  opts?: { query?: Record<string, string | number | boolean>; extraFields?: Record<string, unknown> },
): Promise<{ blob: Blob; headers: Headers }> {
  const url = new URL(utilitiesApiUrl(path));
  for (const [k, v] of Object.entries(opts?.query ?? {})) {
    url.searchParams.set(k, String(v));
  }

  const form = new FormData();
  form.append("file", file);
  for (const [k, v] of Object.entries(opts?.extraFields ?? {})) {
    form.append(k, typeof v === "string" ? v : JSON.stringify(v));
  }

  const res = await fetch(url.toString(), { method: "POST", body: form });
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
  const blob = await res.blob();
  return { blob, headers: res.headers };
}

/** POSTs JSON, expects a plain-text (HTML) response back. */
export async function postForText(path: string, body: unknown): Promise<string> {
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
  return res.text();
}
