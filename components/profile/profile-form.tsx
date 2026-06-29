"use client";

import { useMemo, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { Camera, Upload } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormSection } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
  organizationName?: string | null;
};

export function ProfileForm({ user, organizationName }: ProfileFormProps) {
  const [state, formAction] = useFormState(updateProfileAction, {});
  const [imageUrl, setImageUrl] = useState(user.image ?? "");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();

  const initials = useMemo(
    () =>
      user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [user.name]
  );

  function handleImageUpload(file: File | undefined) {
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setUploadError(
        "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Please choose an image smaller than 2MB.");
      return;
    }

    startUploadTransition(async () => {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);
      body.append("folder", "clouddesk/avatars");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body,
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => null);
        setUploadError(
          errorDetails?.error?.message ??
            "Image upload failed. Check your Cloudinary preset."
        );
        return;
      }

      const result = (await response.json()) as { secure_url?: string };

      if (!result.secure_url) {
        setUploadError("Cloudinary did not return an image URL.");
        return;
      }

      setImageUrl(result.secure_url);
      setUploadSuccess("Image uploaded. Save profile to keep this avatar.");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="size-24">
            {imageUrl && <AvatarImage src={imageUrl} alt={user.name} />}
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="mt-4 text-lg">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="mt-1 font-medium capitalize">
              {user.role.replace(/_/g, " ").toLowerCase()}
            </p>
          </div>
          {organizationName && (
            <div className="rounded-md border bg-background p-3">
              <p className="text-xs text-muted-foreground">Workspace</p>
              <p className="mt-1 font-medium">{organizationName}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your display name and profile image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="image" value={imageUrl} />
            <FormSection>
              <FormField label="Full name" htmlFor="name">
                <Input id="name" name="name" defaultValue={user.name} required />
              </FormField>
              <FormField
                label="Profile image"
                htmlFor="profileImage"
                hint="Upload a JPG, PNG, or WebP image up to 2MB."
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) => handleImageUpload(event.target.files?.[0])}
                  />
                  <label
                    htmlFor="profileImage"
                    aria-disabled={isUploading}
                    className={buttonVariants({
                      variant: "outline",
                      className: isUploading
                        ? "pointer-events-none sm:w-36 opacity-50"
                        : "cursor-pointer sm:w-36",
                    })}
                  >
                    {isUploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload className="size-4" />
                        Upload
                      </>
                    )}
                  </label>
                  <p className="flex items-center text-sm text-muted-foreground">
                    Choose an image to upload it to Cloudinary.
                  </p>
                </div>
              </FormField>
              <FormField label="Image URL" htmlFor="imageUrl">
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                />
              </FormField>
              {(uploadError || uploadSuccess || state.error || state.success) && (
                <div
                  className={
                    uploadSuccess || state.success
                      ? "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                      : "rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  }
                >
                  {uploadError ?? state.error ?? uploadSuccess ?? state.success}
                </div>
              )}
            </FormSection>
            <Button type="submit">
              <Camera className="size-4" />
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
