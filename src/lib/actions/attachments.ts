"use server";

import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import type { AttachmentRelatedType, ID } from "@/lib/data/types";
import { isDemo } from "../demo";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
];

export type UploadAttachmentState = { error: string } | undefined;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

// Talks to Supabase Storage directly rather than through DataClient, same
// reasoning as lib/actions/auth.ts talking to Supabase Auth directly --
// there's no meaningful "mock" for raw byte storage. The resulting row
// insert (addAttachment) stays behind the DataClient abstraction, since
// that's genuinely swappable domain data.
export async function uploadAttachmentAction(
  relatedType: AttachmentRelatedType,
  relatedId: ID,
  projectId: ID,
  _prevState: UploadAttachmentState,
  formData: FormData,
): Promise<UploadAttachmentState> {
  if (isDemo) return { error: "You are in Demo mode" };
  const file = formData.get("file");
  const caption = String(formData.get("caption") ?? "").trim() || null;

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file first." };
  }
  // An empty file.type (some odd files, some mobile edge cases) would
  // otherwise silently upload as text/plain and fail the bucket's mime
  // check with a confusing error -- reject it here with a clear message.
  if (!file.type || !ALLOWED_MIME_TYPES.includes(file.type)) {
    return { error: "Only images and PDFs are supported right now." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { error: "That file's too big — 10MB max." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { error: "You're not signed in." };
  }

  const path = `${relatedType}/${relatedId}/${Date.now()}-${sanitizeFileName(file.name)}`;

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from("attachments")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { error: "Upload failed — try again." };
  }

  await dataClient.addAttachment({
    relatedType,
    relatedId,
    fileUrl: path,
    caption,
    uploadedById: user.id,
  });

  revalidatePath(`/projects/${projectId}`);
  return undefined;
}

export type DeleteAttachmentState = { error: string } | undefined;

// The caller (a client component that already has the attachment in scope)
// passes fileUrl directly, so this doesn't need an extra lookup.
export async function deleteAttachmentAction(
  attachmentId: ID,
  fileUrl: string,
  projectId: ID,
): Promise<DeleteAttachmentState> {
  // The demo has no real file storage, so only the mock row gets deleted.
  if (!isDemo) {
    const supabase = await createClient();
    await supabase.storage.from("attachments").remove([fileUrl]);
  }
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You're not signed in." };
  }

  const supabase = await createClient();
  await supabase.storage.from("attachments").remove([fileUrl]);

  try {
    await dataClient.deleteAttachment(attachmentId);
  } catch {
    return { error: "Couldn't delete that — try again." };
  }

  revalidatePath(`/projects/${projectId}`);
  return undefined;
}
