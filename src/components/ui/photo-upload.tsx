"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface PhotoUploadProps {
  currentUrl?: string | null;
  folder: string;
  onUploaded: (url: string) => void;
}

export function PhotoUpload({ currentUrl, folder, onUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setError("Upload failed. Please try again.");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    setPreview(publicUrl);
    onUploaded(publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-gray-50 transition-colors hover:border-primary hover:bg-primary-light"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile photo"
            fill
            className="object-cover"
            sizes="192px"
          />
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
            </svg>
            <p className="mt-1 text-xs text-gray-500">
              {uploading ? "Uploading..." : "Click to upload"}
            </p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-muted">JPG, PNG or WebP. Max 5MB.</p>
    </div>
  );
}
