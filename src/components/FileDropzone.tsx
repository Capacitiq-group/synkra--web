import { useRef, useState } from "react";

export default function FileDropzone({
  accept,
  file,
  onFile,
  hint,
}: {
  accept: string;
  file: File | null;
  onFile: (f: File | null) => void;
  hint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
        dragging ? "border-[#56d722] bg-[#56d722]/5" : "border-white/10 hover:border-white/25"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <>
          <p className="text-sm font-medium text-white">{file.name}</p>
          <p className="mt-1 text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFile(null); }}
            className="mt-3 text-xs text-white/50 underline hover:text-white"
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <p className="body-sm text-white/60">Drag a file here, or click to browse</p>
          <p className="mt-1 text-xs text-white/30">{hint}</p>
        </>
      )}
    </div>
  );
}
