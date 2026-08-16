import { dataClient } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { AttachmentUploadForm } from "./AttachmentUploadForm";
import { ConfirmDeleteButton } from "@/components/shared/ConfirmDeleteButton";
import { deleteAttachmentAction } from "@/lib/actions/attachments";
import type { AttachmentRelatedType, ID } from "@/lib/data/types";

function isImage(fileUrl: string): boolean {
  const ext = fileUrl.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "webp", "heic"].includes(ext ?? "");
}

function iconFor(fileUrl: string): string {
  const ext = fileUrl.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (isImage(fileUrl)) return "IMG";
  return "FILE";
}

export async function AttachmentsList({
  relatedType,
  relatedId,
  projectId,
}: {
  relatedType: AttachmentRelatedType;
  relatedId: ID;
  projectId: ID;
}) {
  const [attachments, users] = await Promise.all([
    dataClient.listAttachments(relatedType, relatedId),
    dataClient.listUsers(),
  ]);

  const userById = new Map(users.map((u) => [u.id, u]));

  const resolved = await Promise.all(
    attachments.map(async (a) => ({
      attachment: a,
      url: await dataClient.getAttachmentUrl(a.fileUrl),
    }))
  );

  return (
    <div className="space-y-3">
      {resolved.length === 0 ? (
        <p className="text-sm text-ink-soft">No files yet.</p>
      ) : (
        <ul className="space-y-2">
          {resolved.map(({ attachment: a, url }) => (
            <li
              key={a.id}
              className="flex items-center gap-3 border border-border px-3 py-2"
            >
              {url && isImage(a.fileUrl) ? (
                // Signed URL expires and is unique per render; next/image's
                // cache doesn't fit that, and these are small fixed thumbnails.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={a.caption ?? ""}
                  className="h-10 w-10 shrink-0 border border-border object-cover"
                />
              ) : (
                <span className="shrink-0 border border-border px-1.5 py-0.5 font-mono text-[0.62rem] tracking-wide text-ink-soft">
                  {url ? iconFor(a.fileUrl) : "N/A"}
                </span>
              )}
              <div className="min-w-0 flex-1">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm hover:text-primary"
                  >
                    {a.caption ?? a.fileUrl.split("/").pop()}
                  </a>
                ) : (
                  <p className="truncate text-sm text-ink-soft">
                    {a.caption ?? a.fileUrl.split("/").pop()}{" "}
                    <span className="italic">(file unavailable)</span>
                  </p>
                )}
                <p className="font-mono text-xs text-ink-soft">
                  {userById.get(a.uploadedById)?.name ?? "Unknown"} &middot;{" "}
                  {formatDate(a.uploadedAt)}
                </p>
              </div>
              <ConfirmDeleteButton
                action={deleteAttachmentAction.bind(null, a.id, a.fileUrl, projectId)}
                itemLabel="attachment"
              />
            </li>
          ))}
        </ul>
      )}
      <AttachmentUploadForm
        relatedType={relatedType}
        relatedId={relatedId}
        projectId={projectId}
      />
    </div>
  );
}
