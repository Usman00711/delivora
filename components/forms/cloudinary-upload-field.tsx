"use client";

import { useState, useTransition } from "react";
import { FileUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CloudinaryUploadFieldProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  accept?: string;
  maxSizeMb?: number;
  resourceType?: "image" | "auto";
};

export function CloudinaryUploadField({
  id,
  name,
  value,
  onChange,
  folder,
  accept = "image/png,image/jpeg,image/webp,application/pdf,.doc,.docx,.zip,.txt,.md",
  maxSizeMb = 10,
  resourceType = "auto",
}: CloudinaryUploadFieldProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isUploading, startUploadTransition] = useTransition();

  function handleUpload(file: File | undefined) {
    if (!file) return;

    setMessage(null);
    setIsError(false);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setIsError(true);
      setMessage("Cloudinary is not configured.");
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      setIsError(true);
      setMessage(`Please choose a file smaller than ${maxSizeMb}MB.`);
      return;
    }

    startUploadTransition(async () => {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);
      body.append("folder", folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          body,
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => null);
        setIsError(true);
        setMessage(
          errorDetails?.error?.message ??
            "Upload failed. Check the Cloudinary upload preset."
        );
        return;
      }

      const result = (await response.json()) as {
        secure_url?: string;
        original_filename?: string;
      };

      if (!result.secure_url) {
        setIsError(true);
        setMessage("Cloudinary did not return a file URL.");
        return;
      }

      onChange(result.secure_url);
      setMessage(
        `${result.original_filename ?? "File"} uploaded. Save the form to keep it.`
      );
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => handleUpload(event.target.files?.[0])}
        />
        <label
          htmlFor={id}
          aria-disabled={isUploading}
          className={buttonVariants({
            variant: "outline",
            className: isUploading
              ? "pointer-events-none sm:w-40 opacity-50"
              : "cursor-pointer sm:w-40",
          })}
        >
          <FileUp className="size-4" />
          {isUploading ? "Uploading..." : "Upload file"}
        </label>
        <p className="flex items-center text-sm text-muted-foreground">
          PDF, docs, zip, images, or text up to {maxSizeMb}MB.
        </p>
      </div>
      <Input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://res.cloudinary.com/..."
      />
      {message && (
        <div
          className={
            isError
              ? "rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              : "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
          }
        >
          {message}
        </div>
      )}
    </div>
  );
}
