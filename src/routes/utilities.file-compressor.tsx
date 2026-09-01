import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buildHead } from "@/lib/seo";
import { postFileForBlob, UtilitiesApiError } from "@/lib/utilitiesApi";
import FileDropzone from "@/components/FileDropzone";

export const Route = createFileRoute("/utilities/file-compressor")({
  head: () =>
    buildHead({
      title: "File Compressor",
      description: "Shrink PDF and DOCX file sizes, free. No account required.",
      path: "/utilities/file-compressor",
    }),
  component: Page,
});

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [imageQuality, setImageQuality] = useState(70);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [stats, setStats] = useState<{ before: number; after: number; savedPct: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { blob, headers } = await postFileForBlob("/file/compress", file, { query: { image_quality: imageQuality } });
      setResultBlob(blob);
      setStats({
        before: Number(headers.get("X-Original-Size-Bytes") ?? 0),
        after: Number(headers.get("X-Compressed-Size-Bytes") ?? 0),
        savedPct: Number(headers.get("X-Size-Saved-Percent") ?? 0),
      });
    } catch (e) {
      setError(e instanceof UtilitiesApiError ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!resultBlob) return;
    const ext = file?.name.toLowerCase().endsWith(".docx") ? ".docx" : ".pdf";
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Free Tool</p>
        <h1 className="heading-display mt-6 max-w-[800px]">File Compressor</h1>
        <p className="body-text mt-6 max-w-[600px]">
          Shrink PDF and DOCX file sizes by recompressing embedded images.
          For plain images, use the Image Compressor instead. Nothing is
          stored. Your file is deleted the moment processing finishes.
        </p>
      </div>
      <div className="container-main"><div className="hairline" /></div>
      <div className="container-main section-padding">
        <div className="mx-auto max-w-[560px] space-y-6">
          <FileDropzone
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            file={file}
            onFile={(f) => { setFile(f); setResultBlob(null); setStats(null); }}
            hint="PDF or DOCX, up to 25 MB"
          />
          <div>
            <label className="label-tag block">Embedded image quality ({imageQuality})</label>
            <input type="range" min={1} max={95} value={imageQuality} onChange={(e) => setImageQuality(Number(e.target.value))} className="mt-2 w-full" />
          </div>
          <button onClick={run} disabled={!file || busy} className="btn-primary w-full justify-center disabled:opacity-60">
            {busy ? "Compressing..." : "Compress file"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {stats && (
            <p className="body-sm text-center text-[var(--color-brand-green)]">
              {(stats.before / 1024).toFixed(0)} KB → {(stats.after / 1024).toFixed(0)} KB
              ({stats.savedPct}% smaller)
            </p>
          )}
          {resultBlob && (
            <button onClick={download} className="btn-secondary w-full justify-center">
              Download compressed file
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
