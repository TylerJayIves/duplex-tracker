"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  uploadAttachmentAction,
  type UploadAttachmentState,
} from "@/lib/actions/attachments";
import { Button } from "@/components/ui/button";
import type { AttachmentRelatedType, ID } from "@/lib/data/types";

export function AttachmentUploadForm({
  relatedType,
  relatedId,
  projectId,
}: {
  relatedType: AttachmentRelatedType;
  relatedId: ID;
  projectId: ID;
}) {
  const boundAction = uploadAttachmentAction.bind(
    null,
    relatedType,
    relatedId,
    projectId
  );
  const [state, formAction, isPending] = useActionState<
    UploadAttachmentState,
    FormData
  >(boundAction, undefined);

  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) {
      formRef.current?.reset();
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          name="file"
          accept="application/pdf,image/jpeg,image/png,image/webp,image/heic"
          required
          className="min-w-0 flex-1 text-xs text-ink-soft file:mr-3 file:border file:border-border file:bg-paper-raised file:px-2 file:py-1 file:font-mono file:text-[0.68rem] file:tracking-wide file:uppercase"
        />
        <input
          type="text"
          name="caption"
          placeholder="Caption (optional)"
          className="min-w-0 flex-1 border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {state?.error && <p className="text-xs text-brick">{state.error}</p>}
    </form>
  );
}
