import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { buildHead } from "@/lib/seo";
import { postFileForBlob, UtilitiesApiError } from "@/lib/utilitiesApi";
import FileDropzone from "@/components/FileDropzone";

export const Route = createFileRoute("/utilities/image-compressor")({
  head: () =>
    buildHead({
      title: "Image Compressor",
      description:
        "Shrink JPG, PNG, and WebP file sizes without losing quality, free. No account required.",
      path: "/utilities/image-compressor",
    }),
  component: Page,
});

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(75);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<{ before: number; after: number; savedPct: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current); }, []);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { blob, headers } = await postFileForBlob("/image/compress", file, { query: { quality } });
      const url = URL.createObjectURL(blob);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = url;
      setPreviewUrl(url);
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
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = "compressed" + (file?.name.match(/\.\w+$/)?.[0] ?? ".jpg");
    a.click();
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Free Tool</p>
        <h1 className="heading-display mt-6 max-w-[800px]">Image Compressor</h1>
        <p className="body-text mt-6 max-w-[600px]">
          Shrink JPG, PNG, and WebP file sizes without losing quality.
          Nothing is stored. Your file is deleted the moment processing
          finishes.
        </p>
      </div>
      <div className="container-main"><div className="hairline" /></div>
      <div className="container-main section-padding">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <FileDropzone accept="image/jpeg,image/png,image/webp" file={file} onFile={setFile} hint="JPG, PNG, or WebP, up to 15 MB" />
            <div>
              <label className="label-tag block">Quality ({quality})</label>
              <input type="range" min={1} max={95} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="mt-2 w-full" />
              <p className="mt-1 text-xs text-white/40">Lower = smaller file, more compression artifacts.</p>
            </div>
            <button onClick={run} disabled={!file || busy} className="btn-primary w-full justify-center disabled:opacity-60">
              {busy ? "Compressing..." : "Compress image"}
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
          <div className="flex flex-col items-center justify-start">
            <div className="flex h-[320px] w-full max-w-[320px] items-center justify-center rounded-2xl border border-white/5 bg-[#0f0f0f]">
              {previewUrl ? (
                <img src={previewUrl} alt="Compressed" className="max-h-full max-w-full" />
              ) : (
                <p className="body-sm px-8 text-center text-white/30">Your result will appear here</p>
              )}
            </div>
            {stats && (
              <p className="body-sm mt-4 text-center text-[var(--color-brand-green)]">
                {(stats.before / 1024).toFixed(0)} KB → {(stats.after / 1024).toFixed(0)} KB
                ({stats.savedPct}% smaller)
              </p>
            )}
            {previewUrl && <button onClick={download} className="btn-secondary mt-4">Download</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
