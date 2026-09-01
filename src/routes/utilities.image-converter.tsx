import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { buildHead } from "@/lib/seo";
import { postFileForBlob, UtilitiesApiError } from "@/lib/utilitiesApi";
import FileDropzone from "@/components/FileDropzone";

export const Route = createFileRoute("/utilities/image-converter")({
  head: () =>
    buildHead({
      title: "Image Converter",
      description: "Convert between JPG, PNG, and WebP, free. No account required.",
      path: "/utilities/image-converter",
    }),
  component: Page,
});

type Format = "jpg" | "png" | "webp";

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>("png");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current); }, []);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { blob } = await postFileForBlob("/image/convert", file, { query: { target_format: targetFormat } });
      const url = URL.createObjectURL(blob);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = url;
      setPreviewUrl(url);
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
    a.download = `converted.${targetFormat}`;
    a.click();
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Free Tool</p>
        <h1 className="heading-display mt-6 max-w-[800px]">Image Converter</h1>
        <p className="body-text mt-6 max-w-[600px]">
          Convert between JPG, PNG, and WebP. Nothing is stored, your file
          is deleted the moment processing finishes.
        </p>
      </div>
      <div className="container-main"><div className="hairline" /></div>
      <div className="container-main section-padding">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <FileDropzone accept="image/jpeg,image/png,image/webp" file={file} onFile={setFile} hint="JPG, PNG, or WebP, up to 15 MB" />
            <div>
              <label className="label-tag block">Convert to</label>
              <div className="mt-2 flex gap-2">
                {(["jpg", "png", "webp"] as Format[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTargetFormat(f)}
                    className={`rounded-full px-4 py-1.5 text-sm uppercase transition-colors ${
                      targetFormat === f ? "bg-[#56d722] text-[#0a0a0a] font-semibold" : "border border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={run} disabled={!file || busy} className="btn-primary w-full justify-center disabled:opacity-60">
              {busy ? "Converting..." : "Convert image"}
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
          <div className="flex flex-col items-center justify-start">
            <div className="flex h-[320px] w-full max-w-[320px] items-center justify-center rounded-2xl border border-white/5 bg-[#0f0f0f]">
              {previewUrl ? (
                <img src={previewUrl} alt="Converted" className="max-h-full max-w-full" />
              ) : (
                <p className="body-sm px-8 text-center text-white/30">Your result will appear here</p>
              )}
            </div>
            {previewUrl && <button onClick={download} className="btn-secondary mt-6">Download {targetFormat.toUpperCase()}</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
