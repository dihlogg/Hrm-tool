import React, { useEffect, useState } from "react";
import { Avatar, Button, Input, Dropdown, Popconfirm, Spin } from "antd";
import { MoreOutlined, UserOutlined } from "@ant-design/icons";
import { CommentDto } from "@/hooks/social/comment/CommentDto";
import { CommentReaction } from "./CommentReaction";
import {
  normalizeReactionType,
  REACTION_MAP,
} from "../reaction/ReactionConstants";
import { useGetReplies } from "@/hooks/social/comment/useGetReplies";
import { CommentInput } from "./CommentInput";

interface CommentItemProps {
  comment: CommentDto;
  currentUserId?: string;
  currentUserAvatar?: string | null;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => Promise<void>;
  onSendReply: (parentId: string, content: string, mentionedEmployeeIds: string[]) => Promise<void>;
  isReply?: boolean;
}

export const CommentItem = ({
  comment,
  currentUserId,
  currentUserAvatar,
  onDelete,
  onUpdate,
  onSendReply,
  isReply = false,
}: CommentItemProps) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hotReload, setHotReload] = useState(0);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyPage, setReplyPage] = useState(1);

  const initialTotalReactions = (comment.reactionCounts || []).reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const [localMyReaction, setLocalMyReaction] = useState<string | null>(
    comment.myReaction || null,
  );
  const [localTotalReactions, setLocalTotalReactions] = useState<number>(
    initialTotalReactions,
  );
  const [localReactionCounts, setLocalReactionCounts] = useState(
    comment.reactionCounts || [],
  );

  useEffect(() => {
    setLocalMyReaction(comment.myReaction || null);
    setLocalTotalReactions(
      (comment.reactionCounts || []).reduce((sum, item) => sum + item.count, 0),
    );
    setLocalReactionCounts(comment.reactionCounts || []);
  }, [comment.myReaction, comment.reactionCounts]);

  const handleReactionChanged = (newReactionType: string | null) => {
    const prevReaction = localMyReaction;
    let updatedCounts = [...localReactionCounts];

    if (prevReaction) {
      const prevIndex = updatedCounts.findIndex(
        (r) => r.reactionType === prevReaction,
      );
      if (prevIndex > -1) {
        updatedCounts[prevIndex] = {
          ...updatedCounts[prevIndex],
          count: updatedCounts[prevIndex].count - 1,
        };
      }
    }

    if (newReactionType) {
      const newIndex = updatedCounts.findIndex(
        (r) => r.reactionType === newReactionType,
      );
      if (newIndex > -1) {
        updatedCounts[newIndex] = {
          ...updatedCounts[newIndex],
          count: updatedCounts[newIndex].count + 1,
        };
      } else {
        updatedCounts.push({
          id: Date.now().toString(),
          reactionType: newReactionType,
          count: 1,
        });
      }
    }

    updatedCounts = updatedCounts.filter((r) => r.count > 0);

    setLocalReactionCounts(updatedCounts);
    setLocalTotalReactions(
      updatedCounts.reduce((sum, item) => sum + item.count, 0),
    );
    setLocalMyReaction(newReactionType);
  };

  const {
    replies,
    loading: loadingReplies,
    total,
  } = useGetReplies(showReplies ? comment.id : null, replyPage, 5, hotReload);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setIsUpdating(true);
    await onUpdate(comment.id, editText);
    setIsUpdating(false);
    setEditing(false);
  };

  const handleSubmitReply = async (content: string, mentionedEmployeeIds: string[]) => {
    const targetParentId = isReply ? comment.parentId || comment.id : comment.id;
    await onSendReply(targetParentId, content, mentionedEmployeeIds);
    setShowReplyInput(false);

    if (!isReply) {
      setReplyPage(1);
      setShowReplies(true);
      setHotReload((prev) => prev + 1);
    }
  };

  const handleChildSendReply = async (parentId: string, content: string, mentionedEmployeeIds: string[]) => {
    await onSendReply(parentId, content, mentionedEmployeeIds);
    setReplyPage(1);
    setShowReplies(true);
    setHotReload((prev) => prev + 1);
  };

  // Hàm render dùng để tô xanh Mention
  const renderCommentContent = (content: string) => {
    const mentionRegex = /(@\w+)/g;
    const parts = content.split(mentionRegex);

    return parts.map((part, i) => {
      if (part.match(mentionRegex)) {
        return (
          <span key={i} className="font-semibold text-blue-600 cursor-pointer hover:underline">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const validReactions = localReactionCounts.filter((r) => r.count > 0);

  const topReactions = [...validReactions]
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);

  const displayDate = new Date(comment.createDate).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className={`flex flex-col gap-1 mb-1 ${isReply ? "mt-2" : "mt-0"}`}>
      <div className="flex items-start gap-2 group">
        <Avatar
          src={comment.employeeAvatarUrl || undefined}
          icon={!comment.employeeAvatarUrl && <UserOutlined />}
          size={isReply ? 28 : 36}
          className="mt-1 cursor-pointer shrink-0"
        />
        <div className="flex-1 max-w-[85%]">
          <div className="flex items-center gap-2">
            {/* Đã bỏ flex-1 ở thẻ bọc bong bóng comment để Dropdown bám sát vào */}
            <div className="relative">
              <div className="inline-block px-3 py-2 bg-[#F0F2F5] rounded-2xl relative min-w-[120px]">
                <span className="block text-[13px] font-bold text-[#050505] cursor-pointer hover:underline">
                  {comment.employeeFullName || "Unknown"}
                </span>

                {editing ? (
                  <div className="mt-1 min-w-[250px]">
                    <Input.TextArea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      className="text-sm !mb-2"
                      disabled={isUpdating}
                    />
                    <div className="flex gap-2 text-xs">
                      <span
                        className="font-medium text-blue-500 cursor-pointer hover:underline"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </span>
                      <span
                        className="text-gray-400 cursor-pointer hover:underline"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </span>
                    </div>
                  </div>
                ) : (
                  // Đã gọi renderCommentContent để bôi xanh text
                  <span className="text-[15px] text-[#050505] break-words whitespace-pre-wrap leading-tight">
                    {renderCommentContent(comment.content)}
                  </span>
                )}
              </div>
            </div>

            {/* Menu Dropdown - Đã thêm nút Edit vào đây */}
            {comment.employeeId === currentUserId && !editing && (
              <div className="self-center transition-opacity opacity-0 shrink-0 group-hover:opacity-100">
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: [
                      {
                        key: "edit",
                        label: (
                          <span 
                            className="block w-full"
                            onClick={() => setEditing(true)}
                          >
                            Edit
                          </span>
                        ),
                      },
                      {
                        key: "delete",
                        label: (
                          <Popconfirm
                            title="Delete Comment"
                            onConfirm={() => onDelete(comment.id)}
                            okText="Delete"
                            cancelText="Cancel"
                          >
                            <span className="block w-full text-red-500">
                              Delete
                            </span>
                          </Popconfirm>
                        ),
                      },
                    ],
                  }}
                >
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    icon={<MoreOutlined className="text-gray-400" />}
                  />
                </Dropdown>
              </div>
            )}
          </div>

          {/* Action Row */}
          {!editing && (
            <div className="flex items-center gap-4 mt-1 ml-3 text-[12px] font-bold text-[#65676B]">
              <span className="font-normal">{displayDate}</span>
              <CommentReaction
                postCommentId={comment.id}
                myReaction={localMyReaction}
                onReactionChanged={handleReactionChanged}
              />
              <span
                className="cursor-pointer hover:underline"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                Reply
              </span>
              {/* Đã bỏ nút Edit ở dưới cùng này vì đã dời lên Dropdown */}
              
              {localTotalReactions > 0 && (
                <div className="flex items-center bg-white rounded-full p-[2px] shadow-sm border border-gray-100">
                  <div className="flex items-center -space-x-1">
                    {topReactions.map((r, index) => {
                      const type = normalizeReactionType(r.reactionType);
                      const reactInfo = type ? REACTION_MAP[type] : null;
                      return (
                        <div
                          key={r.reactionType}
                          className={`flex items-center justify-center w-[18px] h-[18px] rounded-full bg-white z-[${2 - index}] [&>img]:!w-full [&>img]:!h-full`}
                        >
                          {reactInfo?.icon}
                        </div>
                      );
                    })}
                  </div>
                  {localTotalReactions > 1 && (
                    <span className="text-[11px] text-gray-500 ml-1 font-medium pr-1">
                      {localTotalReactions}
                    </span>
                  )}
                </div>
              )}
              {comment.updateDate &&
                comment.updateDate !== comment.createDate && (
                  <span className="font-normal text-[11px]">Edited</span>
                )}
            </div>
          )}

          {showReplyInput && (
            <CommentInput
              avatarUrl={currentUserAvatar}
              placeholder={`Reply to ${comment.employeeFullName}...`}
              onSubmit={handleSubmitReply}
              autoFocus
              size={28}
            />
          )}

          {!isReply &&
            (comment.children?.length || comment.repliesCount || 0) > 0 && (
              <div className="mt-1">
                {!showReplies ? (
                  <span
                    className="text-[13px] font-semibold text-[#65676B] cursor-pointer hover:underline ml-3 flex items-center gap-2"
                    onClick={() => setShowReplies(true)}
                  >
                    <span className="w-6 h-[1px] bg-gray-300"></span> View{" "}
                    {comment.children?.length || comment.repliesCount} replies
                  </span>
                ) : (
                  <div className="pl-3 mt-2 ml-8 border-l-2 border-gray-100">
                    {replies.map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        currentUserId={currentUserId}
                        currentUserAvatar={currentUserAvatar}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        onSendReply={handleChildSendReply}
                        isReply={true}
                      />
                    ))}
                    {loadingReplies && (
                      <Spin size="small" className="block my-2" />
                    )}
                    {total > replies.length && !loadingReplies && (
                      <span
                        className="text-[13px] font-semibold text-[#65676B] cursor-pointer hover:underline flex items-center gap-2 mt-2"
                        onClick={() => setReplyPage((p) => p + 1)}
                      >
                        <span className="w-6 h-[1px] bg-gray-300"></span> View
                        more replies
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};