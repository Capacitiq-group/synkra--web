import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buildHead } from "@/lib/seo";
import { postFileForBlob, UtilitiesApiError } from "@/lib/utilitiesApi";
import FileDropzone from "@/components/FileDropzone";

export const Route = createFileRoute("/utilities/csv-cleaner")({
  head: () =>
    buildHead({
      title: "CSV Cleaner",
      description:
        "Clean up messy spreadsheet exports before you import them anywhere else, free. No account required.",
      path: "/utilities/csv-cleaner",
    }),
  component: Page,
});

const OPERATIONS: { key: string; label: string; hint: string }[] = [
  { key: "trim_whitespace", label: "Trim whitespace", hint: "Removes leading/trailing spaces from every cell." },
  { key: "remove_blank_rows", label: "Remove blank rows", hint: "Drops rows that are entirely empty." },
  { key: "remove_duplicates", label: "Remove duplicate rows", hint: "Keeps only the first occurrence." },
  { key: "standardise_headers", label: "Standardise column headers", hint: "Lowercase, spaces become underscores." },
  { key: "standardise_casing", label: "Title Case text columns", hint: "Applies Title Case to text values." },
  { key: "validate_emails", label: "Flag invalid emails", hint: "Adds a _valid column next to any email column. Doesn't delete rows." },
  { key: "flag_bad_phones", label: "Flag malformed phone numbers", hint: "Adds a _valid column next to any phone column." },
  { key: "normalise_dates", label: "Normalise dates to YYYY-MM-DD", hint: "Best-effort parse of columns with 'date' in the name." },
];

const DEFAULT_OPS = ["trim_whitespace", "remove_blank_rows", "remove_duplicates"];

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [ops, setOps] = useState<string[]>(DEFAULT_OPS);
  const [dateColumns, setDateColumns] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [rowStats, setRowStats] = useState<{ before: number; after: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(key: string) {
    setOps((o) => (o.includes(key) ? o.filter((x) => x !== key) : [...o, key]));
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResultBlob(null);
    try {
      const { blob, headers } = await postFileForBlob("/csv/clean", file, {
        extraFields: {
          options: {
            operations: ops,
            date_columns: dateColumns.split(",").map((s) => s.trim()).filter(Boolean),
          },
        },
      });
      setResultBlob(blob);
      setRowStats({
        before: Number(headers.get("X-Rows-Before") ?? 0),
        after: Number(headers.get("X-Rows-After") ?? 0),
      });
    } catch (e) {
      setError(e instanceof UtilitiesApiError ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cleaned.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Free Tool</p>
        <h1 className="heading-display mt-6 max-w-[800px]">CSV Cleaner</h1>
        <p className="body-text mt-6 max-w-[600px]">
          Clean up messy spreadsheet exports before you import them
          anywhere else. Pick exactly which operations to run. Nothing
          happens to your data that you didn't ask for.
        </p>
      </div>
      <div className="container-main"><div className="hairline" /></div>
      <div className="container-main section-padding">
        <div className="mx-auto max-w-[640px] space-y-8">
          <FileDropzone accept=".csv,text/csv" file={file} onFile={(f) => { setFile(f); setResultBlob(null); }} hint="CSV, up to 10 MB" />

          <div>
            <p className="label-tag">Operations</p>
            <div className="mt-4 space-y-3">
              {OPERATIONS.map((op) => (
                <label key={op.key} className="flex items-start gap-3">
                  <input type="checkbox" checked={ops.includes(op.key)} onChange={() => toggle(op.key)} className="mt-1" />
                  <span>
                    <span className="block text-sm text-white/80">{op.label}</span>
                    <span className="block text-xs text-white/40">{op.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {ops.includes("normalise_dates") && (
            <div>
              <label className="label-tag block">Date columns (optional, comma-separated)</label>
              <input
                value={dateColumns}
                onChange={(e) => setDateColumns(e.target.value)}
                placeholder="Leave blank to auto-detect columns with 'date' in the name"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#0f0f0f] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[var(--color-brand-green)] focus:outline-none"
              />
            </div>
          )}

          <button onClick={run} disabled={!file || busy} className="btn-primary w-full justify-center disabled:opacity-60">
            {busy ? "Cleaning..." : "Clean CSV"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {rowStats && (
            <p className="body-sm text-center text-[var(--color-brand-green)]">
              {rowStats.before} rows → {rowStats.after} rows
            </p>
          )}
          {resultBlob && (
            <button onClick={download} className="btn-secondary w-full justify-center">
              Download cleaned.csv
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
