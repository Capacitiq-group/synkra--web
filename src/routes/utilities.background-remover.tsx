import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { buildHead } from "@/lib/seo";
import { postFileForBlob, UtilitiesApiError } from "@/lib/utilitiesApi";
import FileDropzone from "@/components/FileDropzone";

export const Route = createFileRoute("/utilities/background-remover")({
  head: () =>
    buildHead({
      title: "Background Remover",
      description:
        "Remove the background from any image automatically, free. JPG, PNG, and WebP supported. No account required.",
      path: "/utilities/background-remover",
    }),
  component: Page,
});

function Page() {
  const [file, setFile] = useState<File | null>(null);
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
      const { blob } = await postFileForBlob("/image/remove-background", file);
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
    a.download = "no-background.png";
    a.click();
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Free Tool</p>
        <h1 className="heading-display mt-6 max-w-[800px]">Background Remover</h1>
        <p className="body-text mt-6 max-w-[600px]">
          Remove the background from any image automatically. Nothing is
          stored — your file is deleted the moment processing finishes.
        </p>
      </div>
      <div className="container-main"><div className="hairline" /></div>
      <div className="container-main section-padding">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <FileDropzone accept="image/jpeg,image/png,image/webp" file={file} onFile={setFile} hint="JPG, PNG, or WebP — up to 15 MB" />
            <button onClick={run} disabled={!file || busy} className="btn-primary w-full justify-center disabled:opacity-60">
              {busy ? "Removing background..." : "Remove background"}
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
          <div className="flex flex-col items-center justify-start">
            <div
              className="flex h-[320px] w-full max-w-[320px] items-center justify-center rounded-2xl border border-white/5"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                backgroundColor: "#0f0f0f",
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Background removed" className="max-h-full max-w-full" />
              ) : (
                <p className="body-sm px-8 text-center text-white/30">Your result will appear here</p>
              )}
            </div>
            {previewUrl && <button onClick={download} className="btn-secondary mt-6">Download PNG</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
