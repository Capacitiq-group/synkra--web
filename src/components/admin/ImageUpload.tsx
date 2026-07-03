import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ImageUpload({
  bucket, value, onChange, multiple = false,
}: {
  bucket: "portfolio-images" | "blog-images";
  value: string[] | string | null;
  onChange: (v: string[] | string) => void;
  multiple?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const list = multiple ? (Array.isArray(value) ? value : []) : [];

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error("Not authenticated");
      const uploaded: string[] = [];
      for (const f of Array.from(files)) {
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
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple={multiple} disabled={busy}
        onChange={(e) => upload(e.target.files)}
        className="text-sm text-[color:var(--color-admin-text-muted)] file:mr-3 file:rounded file:border-0 file:bg-[color:var(--color-admin-accent)] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-black" />
      {multiple ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {list.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="" className="w-full aspect-square object-cover rounded" />
              <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded px-1.5 py-0.5">✕</button>
            </div>
          ))}
        </div>
      ) : (
        value && typeof value === "string" && <img src={value} alt="" className="mt-3 max-w-xs rounded" />
      )}
    </div>
  );
}
