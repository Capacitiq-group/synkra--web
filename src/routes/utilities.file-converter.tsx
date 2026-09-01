import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buildHead } from "@/lib/seo";
import { postFileForBlob, UtilitiesApiError } from "@/lib/utilitiesApi";
import FileDropzone from "@/components/FileDropzone";

export const Route = createFileRoute("/utilities/file-converter")({
  head: () =>
    buildHead({
      title: "File Converter",
      description: "Convert PDF pages to images, or CSV to XLSX, free. No account required.",
      path: "/utilities/file-converter",
    }),
  component: Page,
});

type Mode = "pdf-to-images" | "csv-to-xlsx" | "docx-to-pdf";

const MODES: { key: Mode; label: string; accept: string; hint: string; endpoint: string; download: string }[] = [
  {
    key: "pdf-to-images",
    label: "PDF → Images",
    accept: ".pdf,application/pdf",
    hint: "PDF, up to 25 MB. Returns a ZIP of PNG pages.",
    endpoint: "/file/convert/pdf-to-images",
    download: "pdf-pages.zip",
  },
  {
    key: "csv-to-xlsx",
    label: "CSV → XLSX",
    accept: ".csv,text/csv",
    hint: "CSV, up to 25 MB",
    endpoint: "/file/convert/csv-to-xlsx",
    download: "converted.xlsx",
  },
  {
    key: "docx-to-pdf",
    label: "DOCX → PDF",
    accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    hint: "DOCX, up to 25 MB",
    endpoint: "/file/convert/docx-to-pdf",
    download: "converted.pdf",
  },
];

function Page() {
  const [mode, setMode] = useState<Mode>("pdf-to-images");
  const [file, setFile] = useState<File | null>(null);
  const [dpi, setDpi] = useState(150);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = MODES.find((m) => m.key === mode)!;

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResultBlob(null);
    try {
      const query = mode === "pdf-to-images" ? { dpi } : undefined;
      const { blob } = await postFileForBlob(current.endpoint, file, { query });
      setResultBlob(blob);
    } catch (e) {
      if (e instanceof UtilitiesApiError && e.status === 501) {
        setError("DOCX to PDF is not enabled on this instance yet. Try PDF → Images or CSV → XLSX instead.");
      } else {
        setError(e instanceof UtilitiesApiError ? e.message : "Something went wrong. Try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = current.download;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Free Tool</p>
        <h1 className="heading-display mt-6 max-w-[800px]">File Converter</h1>
        <p className="body-text mt-6 max-w-[600px]">
          Convert PDF pages to images, or CSV to XLSX. Nothing is stored,
          your file is deleted the moment processing finishes.
        </p>
      </div>
      <div className="container-main"><div className="hairline" /></div>
      <div className="container-main section-padding">
        <div className="mx-auto max-w-[560px] space-y-6">
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => { setMode(m.key); setFile(null); setResultBlob(null); setError(null); }}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  mode === m.key ? "bg-[#56d722] text-[#0a0a0a] font-semibold" : "border border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <FileDropzone accept={current.accept} file={file} onFile={(f) => { setFile(f); setResultBlob(null); }} hint={current.hint} />

          {mode === "pdf-to-images" && (
            <div>
              <label className="label-tag block">Resolution ({dpi} DPI)</label>
              <input type="range" min={72} max={300} value={dpi} onChange={(e) => setDpi(Number(e.target.value))} className="mt-2 w-full" />
            </div>
          )}

          <button onClick={run} disabled={!file || busy} className="btn-primary w-full justify-center disabled:opacity-60">
            {busy ? "Converting..." : `Convert (${current.label})`}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {resultBlob && (
            <button onClick={download} className="btn-secondary w-full justify-center">
              Download {current.download}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
