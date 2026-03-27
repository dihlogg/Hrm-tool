"use client";

import { useState, useEffect } from "react";
import { Avatar, Button, Dropdown, Tooltip, Carousel } from "antd";
import {
  MoreOutlined,
  HeartFilled,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PostDto } from "@/hooks/social/post/PostDto";
import { useAuthContext } from "@/contexts/authContext";
import { PostReaction } from "./PostReaction";
import {
  REACTION_MAP,
  normalizeReactionType,
} from "../reaction/ReactionConstants";
import { CustomNextArrow, CustomPrevArrow } from "../common/CarouselArrows";
import PostComments from "../comment/PostComments";
import PostDetailModal from "./PostDetailModal";

interface PostCardProps {
  post: PostDto;
  onEdit: (post: PostDto) => void;
  onDelete: (postId: string) => void;
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const { employee } = useAuthContext();
  const currentUserId = employee?.id;

  const initialMyReaction =
    post.reactions?.find((r) => r.employeeId === currentUserId)?.reactionType ||
    null;

  const initialTotalReactions =
    post.reactionCounts?.reduce((sum, item) => sum + item.count, 0) || 0;

  const [myReaction, setMyReaction] = useState<string | null>(
    initialMyReaction,
  );
  const [totalReactions, setTotalReactions] = useState<number>(
    initialTotalReactions,
  );
  const [localReactionCounts, setLocalReactionCounts] = useState(
    post.reactionCounts || [],
  );

  const [showComments, setShowComments] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(
    post.commentCount || 0,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  const renderPostContent = (content: string) => {
    const mentionRegex = /(@\w+)/g;
    const parts = content.split(mentionRegex);

    return parts.map((part, i) => {
      if (part.match(mentionRegex)) {
        return (
          <span
            key={i}
            className="font-semibold text-blue-600 cursor-pointer hover:underline"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    setMyReaction(
      post.reactions?.find((r) => r.employeeId === currentUserId)
        ?.reactionType || null,
    );
    setTotalReactions(
      post.reactionCounts?.reduce((sum, item) => sum + item.count, 0) || 0,
    );
    setLocalReactionCounts(post.reactionCounts || []);
    setLocalCommentsCount(post.commentCount || 0);
  }, [post, currentUserId]);

  const handleReactionChanged = (newReactionType: string | null) => {
    const prevReaction = myReaction;
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
    setTotalReactions(updatedCounts.reduce((sum, item) => sum + item.count, 0));
    setMyReaction(newReactionType);
  };

  const validReactions = localReactionCounts.filter((r) => r.count > 0);
  const topReactions = [...validReactions]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const reactionTooltipContent = (
    <div className="flex flex-col gap-1 text-sm">
      {validReactions.length > 0 ? (
        validReactions.map((r) => {
          const type = normalizeReactionType(r.reactionType);
          const reactInfo = type ? REACTION_MAP[type] : null;
          return (
            <div
              key={r.reactionType}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-1.5">
                <span className="flex items-center justify-center [&>img]:!w-4 [&>img]:!h-4">
                  {reactInfo?.icon || <HeartFilled className="text-gray-400" />}
                </span>
                <span className="text-gray-100">
                  {reactInfo?.label || r.reactionType}
                </span>
              </span>
              <span className="font-bold">{r.count}</span>
            </div>
          );
        })
      ) : (
        <span>No reactions yet</span>
      )}
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
      {/* Post Header */}
      <div className="flex items-start justify-between p-5">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.employeeAvatarUrl || undefined}
            icon={!post.employeeAvatarUrl && <UserOutlined />}
            size={48}
            className="cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-600 cursor-pointer hover:underline">
              {post.employeeFullName || "Unknown Employee"}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(post.createDate)
                .toLocaleString("en-CA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace(",", "")}
            </span>
          </div>
        </div>

        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: "edit",
                label: <span>Edit Post</span>,
                onClick: () => onEdit(post),
              },
              {
                key: "delete",
                label: <span className="text-red-500">Delete Post</span>,
                onClick: () => onDelete(post.id),
              },
            ],
          }}
        >
          <Button
            type="text"
            shape="circle"
            className="flex items-center justify-center"
            icon={<MoreOutlined className="text-xl text-gray-400" />}
          />
        </Dropdown>
      </div>

      {/* Post Content */}
      <div className="px-5 pb-4 text-sm text-gray-600 whitespace-pre-wrap">
        {renderPostContent(post.content)}
      </div>

      {/* Image Carousel */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="relative px-5 pb-4 group">
          <Carousel
            arrows={post.imageUrls.length > 1}
            dots={post.imageUrls.length > 1}
            infinite={false}
            adaptiveHeight={true}
            prevArrow={<CustomPrevArrow />}
            nextArrow={<CustomNextArrow />}
            className="w-full overflow-hidden bg-[#F0F2F5] rounded-md"
          >
            {post.imageUrls.map((url, index) => (
              <div key={index}>
                <div
                  className="flex items-center justify-center w-full cursor-pointer"
                  onClick={() => setShowDetailModal(true)}
                >
                  <img
                    src={url}
                    alt={`post-image-${index}`}
                    className="object-contain w-full max-h-[400px] sm:max-h-[500px]"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* Post Footer */}
      <div className="flex items-center justify-between px-5 pt-2 pb-5 mt-2 border-t border-gray-50">
        <div className="flex gap-2">
          <PostReaction
            postId={post.id}
            myReaction={myReaction}
            onReactionChanged={handleReactionChanged}
          />

          <button
            className={`flex items-center justify-center cursor-pointer w-10 h-10 ml-2 transition-colors rounded-full hover:bg-gray-200 ${showComments ? "bg-gray-200" : "bg-gray-100"}`}
            onClick={() => setShowComments(!showComments)}
          >
            <MessageOutlined className="text-lg text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col items-end">
          {totalReactions > 0 ? (
            <Tooltip title={reactionTooltipContent} placement="top" arrow>
              <div className="flex items-center gap-1.5 cursor-pointer hover:underline decoration-gray-400">
                <div className="flex items-center -space-x-1.5">
                  {topReactions.map((r, index) => {
                    const type = normalizeReactionType(r.reactionType);
                    const reactInfo = type ? REACTION_MAP[type] : null;
                    return (
                      <div
                        key={r.reactionType}
                        className={`flex items-center justify-center w-[22px] h-[22px] rounded-full border-2 border-white bg-white z-[${3 - index}] [&>img]:!w-full [&>img]:!h-full [&>img]:!object-contain`}
                      >
                        {reactInfo?.icon || (
                          <HeartFilled className="w-full h-full text-gray-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className="text-sm font-semibold text-gray-500">
                  {totalReactions}
                </span>
              </div>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-400">
              <span>0 Reactions</span>
            </div>
          )}

          <div
            className="text-[11px] text-gray-400 mt-0.5 cursor-pointer hover:underline"
            onClick={() => setShowComments(true)}
          >
            {localCommentsCount} Comments
          </div>
        </div>
      </div>
      {showComments && (
        <PostComments
          postId={post.id}
          onCommentAdded={() => setLocalCommentsCount((prev) => prev + 1)}
          onCommentDeleted={() =>
            setLocalCommentsCount((prev) => Math.max(0, prev - 1))
          }
        />
      )}

      <PostDetailModal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        post={post}
        myReaction={myReaction}
        totalReactions={totalReactions}
        localCommentsCount={localCommentsCount}
        onReactionChanged={handleReactionChanged}
        onCommentAdded={() => setLocalCommentsCount((prev) => prev + 1)}
        onCommentDeleted={() =>
          setLocalCommentsCount((prev) => Math.max(0, prev - 1))
        }
      />
    </div>
  );
}
