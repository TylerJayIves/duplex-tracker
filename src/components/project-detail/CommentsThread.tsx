"use client";

import { useOptimistic } from "react";
import { CommentForm } from "./CommentForm";
import { ConfirmDeleteButton } from "@/components/shared/ConfirmDeleteButton";
import { deleteCommentAction } from "@/lib/actions/comments";
import { formatDate } from "@/lib/format";
import type { Comment, User } from "@/lib/data/types";

export function CommentsThread({
  projectId,
  comments,
  users,
  currentUserId,
}: {
  projectId: string;
  comments: Comment[];
  users: User[];
  currentUserId: string;
}) {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: Comment) => [...state, newComment]
  );

  const userById = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-4">
      {optimisticComments.length === 0 ? (
        <p className="text-sm text-ink-soft">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {optimisticComments.map((comment) => (
            <li key={comment.id} className="border-l-2 border-border pl-3">
              <p className="text-sm">{comment.text}</p>
              <div className="mt-1 flex items-center gap-3 font-mono text-xs text-ink-soft">
                <span>
                  {userById.get(comment.authorId)?.name ?? "Unknown"} &middot;{" "}
                  {formatDate(comment.createdAt)}
                </span>
                {comment.authorId === currentUserId && (
                  <ConfirmDeleteButton
                    action={deleteCommentAction.bind(null, comment.id, projectId)}
                    itemLabel="comment"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <CommentForm
        projectId={projectId}
        authorId={currentUserId}
        onOptimisticAdd={addOptimisticComment}
      />
    </div>
  );
}
