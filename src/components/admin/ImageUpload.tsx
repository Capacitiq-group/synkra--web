import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";

export function ImageUpload({
  bucket, value, onChange, multiple = false,
}: {
  bucket: "portfolio-images" | "blog-images";
  value: string[] | string | null;
  onChange: (v: string[] | string) => void;
  multiple?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const list = multiple ? (Array.isArray(value) ? value : []) : [];

  async function upload(files: FileList | File[] | null) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) {
      toast.error("Only image files are allowed");
      return;
    }
    setBusy(true);
    setProgress({ current: 0, total: arr.length });
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error("Not authenticated");
      const uploaded: string[] = [];
      for (let i = 0; i < arr.length; i++) {
        const f = arr[i];
        setProgress({ current: i, total: arr.length });
        const b64 = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result).split(",")[1]);
          r.onerror = rej;
          r.readAsDataURL(f);
        });
        const resp = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
          body: JSON.stringify({ bucket, filename: f.name, contentType: f.type, base64: b64 }),
        });
        if (!resp.ok) throw new Error(await resp.text());
        const j = await resp.json();
        uploaded.push(j.url);
      }
      if (multiple) onChange([...list, ...uploaded]);
      else onChange(uploaded[0]);
      toast.success(`Uploaded ${uploaded.length} file${uploaded.length > 1 ? "s" : ""}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  const pct = progress ? Math.round(((progress.current) / progress.total) * 100) : 0;

  return (
    <div>
      <div
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!busy) upload(e.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? "border-[color:var(--color-admin-accent)] bg-[color:var(--color-admin-surface-2)]" : "border-[color:var(--color-admin-border)]"
        } ${busy ? "opacity-70 cursor-wait" : ""}`}
      >
        <UploadCloud className="h-6 w-6 mx-auto text-[color:var(--color-admin-text-muted)]" />
        <div className="mt-2 text-sm text-[color:var(--color-admin-text)]">
          {busy && progress
            ? `Uploading ${progress.current + 1} of ${progress.total}…`
            : "Drop images here or click to browse"}
        </div>
        {busy && (
          <div className="mt-3 h-1.5 w-full rounded-full bg-[color:var(--color-admin-surface-2)] overflow-hidden">
            <div className="h-full bg-[color:var(--color-admin-accent)] transition-all" style={{ width: `${pct}%` }} />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          disabled={busy}
          className="hidden"
          onChange={(e) => { upload(e.target.files); e.target.value = ""; }}
        />
      </div>
      {multiple ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {list.map((url, i) => (
            <div key={i} className="relative group">
              <img src={url} alt="" className="w-full aspect-square object-cover rounded" />
              <button
                type="button"
                onClick={() => onChange(list.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        value && typeof value === "string" && (
          <div className="mt-3 relative inline-block group">
            <img src={value} alt="" className="max-w-xs rounded" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )
      )}
    </div>
  );
}
