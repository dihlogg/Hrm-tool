"use client";

import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import { useAuthContext } from "@/contexts/authContext";
import { useGetCommentsByPost } from "@/hooks/social/comment/useGetCommentsByPost";
import { useCreateComment } from "@/hooks/social/comment/useCreateComment";
import { useDeleteComment } from "@/hooks/social/comment/useDeleteComment";
import { useUpdateComment } from "@/hooks/social/comment/useUpdateComment";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";

interface PostCommentsProps {
  postId: string;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
  onTotalCalculated?: (total: number) => void;
}

export default function PostComments({
  postId,
  onCommentAdded,
  onCommentDeleted,
  onTotalCalculated,
}: PostCommentsProps) {
  const { employee } = useAuthContext();
  const currentUserId = employee?.id;
  const currentUserAvatar = employee?.imageUrl;

  const [hotReload, setHotReload] = useState(0);
  const [page, setPage] = useState(1);
  const { comments, loading, total } = useGetCommentsByPost(
    postId,
    page,
    10,
    hotReload,
  );

  const { createComment, loading: isCreating } = useCreateComment();
  const { deleteComment } = useDeleteComment();
  const { updateComment } = useUpdateComment();

  useEffect(() => {
    if (!loading && onTotalCalculated) {
      let realTotal = 0;
      comments.forEach((c) => {
        realTotal += 1;
        if (c.children) realTotal += c.children.length;
      });
      onTotalCalculated(realTotal);
    }
  }, [comments, loading, onTotalCalculated]);

  const handleSendComment = async (
    content: string,
    mentionedEmployeeIds: string[],
  ) => {
    try {
      await createComment({
        postId,
        content,
        parentId: null,
        mentionedEmployeeIds,
      });
      setHotReload((prev) => prev + 1);
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      message.error("Failed to send comment");
    }
  };

  const handleSendReply = async (
    parentId: string,
    content: string,
    mentionedEmployeeIds: string[],
  ) => {
    try {
      await createComment({ postId, content, parentId, mentionedEmployeeIds });
      setHotReload((prev) => prev + 1);
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      message.error("Failed to send reply");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setHotReload((prev) => prev + 1);
      if (onCommentDeleted) onCommentDeleted();
    } catch (error) {
      message.error("Failed to delete comment");
    }
  };

  const handleUpdate = async (id: string, content: string) => {
    try {
      await updateComment(id, { content });
      setHotReload((prev) => prev + 1);
    } catch (error) {
      message.error("Failed to update comment");
    }
  };

  return (
    <div className="flex flex-col gap-4 px-5 pt-2 pb-5 border-t border-gray-100 animate-fade-in">
      <div className="flex flex-col gap-4 mt-2">
        {loading && <Spin size="small" className="mx-auto my-2" />}
        {!loading && comments.length === 0 && (
          <span className="text-xs text-center text-gray-400">
            No comments yet. Be the first to comment!
          </span>
        )}

        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            currentUserAvatar={currentUserAvatar}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onSendReply={handleSendReply}
          />
        ))}

        {total > comments.length && !loading && (
          <span
            className="mt-2 text-sm font-semibold text-gray-500 cursor-pointer hover:underline ml-11"
            onClick={() => setPage((prev) => prev + 1)}
          >
            See more comments
          </span>
        )}
      </div>

      <CommentInput
        avatarUrl={currentUserAvatar}
        onSubmit={handleSendComment}
        isLoading={isCreating}
      />
    </div>
  );
}
