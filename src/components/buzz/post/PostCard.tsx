"use client";

import { useState, useEffect } from "react";
import { Avatar, Button, Dropdown, Image as AntImage } from "antd";
import {
  MoreOutlined,
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PostDto } from "@/hooks/social/post/PostDto";
import { useAuthContext } from "@/contexts/authContext";
import { PostReaction } from "./PostReaction";

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

  useEffect(() => {
    setMyReaction(
      post.reactions?.find((r) => r.employeeId === currentUserId)
        ?.reactionType || null,
    );
    setTotalReactions(
      post.reactionCounts?.reduce((sum, item) => sum + item.count, 0) || 0,
    );
  }, [post, currentUserId]);

  const commentsCount = post.postComments?.length || 0;
  const sharesCount = 0;

  const handleReactionChanged = (newReactionType: string | null) => {
    if (newReactionType && !myReaction) {
      setTotalReactions((prev) => prev + 1);
    } else if (!newReactionType && myReaction) {
      setTotalReactions((prev) => Math.max(0, prev - 1));
    }

    setMyReaction(newReactionType);
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl">
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
        {post.content}
      </div>

      {post.imageUrl && (
        <div className="px-5 pb-4">
          <AntImage
            src={post.imageUrl}
            alt="post image"
            className="object-cover rounded-xl max-h-[400px] w-auto"
          />
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

          <button className="flex items-center justify-center w-10 h-10 ml-2 transition-colors bg-gray-100 rounded-full hover:bg-gray-200">
            <MessageOutlined className="text-lg text-gray-600" />
          </button>
          <button className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-100 rounded-full hover:bg-gray-200">
            <ShareAltOutlined className="text-lg text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600">
            <HeartFilled className="text-red-500" />
            <span>{totalReactions} Reactions</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {commentsCount} Comments, {sharesCount} Shares
          </div>
        </div>
      </div>
    </div>
  );
}
