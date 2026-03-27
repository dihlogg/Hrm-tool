"use client";

import React, { useRef } from "react";
import { Modal, Avatar, Carousel } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import { CloseOutlined, HeartFilled, UserOutlined } from "@ant-design/icons";
import { PostDto } from "@/hooks/social/post/PostDto";
import { PostReaction } from "./PostReaction";
import {
  REACTION_MAP,
  normalizeReactionType,
} from "../reaction/ReactionConstants";
import { CustomNextArrow, CustomPrevArrow } from "../common/CarouselArrows";
import PostComments from "../comment/PostComments";

interface PostDetailModalProps {
  open: boolean;
  onClose: () => void;
  post: PostDto;
  myReaction: string | null;
  totalReactions: number;
  localCommentsCount: number;
  onReactionChanged: (newReactionType: string | null) => void;
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
}

export default function PostDetailModal({
  open,
  onClose,
  post,
  myReaction,
  totalReactions,
  localCommentsCount,
  onReactionChanged,
  onCommentAdded,
  onCommentDeleted,
}: PostDetailModalProps) {
  const carouselRef = useRef<CarouselRef>(null);

  const handleAfterOpenChange = (visible: boolean) => {
    if (visible) {
      if (carouselRef.current) {
        carouselRef.current.goTo(0, true);
      }
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    }
  };

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

  const validReactions = (post.reactionCounts || []).filter((r) => r.count > 0);
  const topReactions = [...validReactions]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const hasImages = post.imageUrls && post.imageUrls.length > 0;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      destroyOnClose={true}
      width={hasImages ? 1100 : 550}
      className="post-detail-modal"
      afterOpenChange={handleAfterOpenChange}
      styles={{
        body: { padding: 0 },
        content: { padding: 0, borderRadius: 12, overflow: "hidden" },
      }}
    >
      <div
        className={`flex ${hasImages ? "flex-row" : "flex-col"}`}
        style={{ minHeight: hasImages ? 580 : "auto", maxHeight: "90vh" }}
      >
        {/* Left: Image Carousel */}
        {hasImages && (
          <div
            className="relative flex items-center justify-center overflow-hidden bg-black"
            style={{ width: 550, minHeight: 580 }}
          >
            {open && (
              <Carousel
                ref={carouselRef}
                arrows={post.imageUrls!.length > 1}
                dots={post.imageUrls!.length > 1}
                infinite={false}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                className="w-[550px]"
              >
                {post.imageUrls!.map((url, idx) => (
                  <div key={idx} className="outline-none">
                    <div
                      className="flex items-center justify-center w-full"
                      style={{ height: 580 }}
                    >
                      <img
                        src={url}
                        alt={`post-image-${idx}`}
                        className="object-contain w-full h-full"
                        style={{ maxWidth: 550, maxHeight: 580 }}
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        )}

        {/* Right: Info & Comments */}
        <div
          className="flex flex-col bg-white"
          style={{ width: hasImages ? 550 : "100%", maxHeight: "90vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar
                src={post.employeeAvatarUrl || undefined}
                icon={!post.employeeAvatarUrl && <UserOutlined />}
                size={40}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
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
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 transition-colors rounded-full hover:bg-gray-100"
            >
              <CloseOutlined className="text-gray-500" />
            </button>
          </div>

          {/* Post content */}
          {post.content && (
            <div className="px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap border-b border-gray-100">
              {renderPostContent(post.content)}
            </div>
          )}

          {/* Reactions summary */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <PostReaction
                postId={post.id}
                myReaction={myReaction}
                onReactionChanged={onReactionChanged}
              />
              <span className="text-xs text-gray-500">
                {totalReactions > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="flex items-center -space-x-1">
                      {topReactions.map((r) => {
                        const type = normalizeReactionType(r.reactionType);
                        const reactInfo = type ? REACTION_MAP[type] : null;
                        return (
                          <span
                            key={r.reactionType}
                            className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-white border border-gray-100 [&>img]:!w-full [&>img]:!h-full"
                          >
                            {reactInfo?.icon || (
                              <HeartFilled className="text-gray-400" />
                            )}
                          </span>
                        );
                      })}
                    </span>
                    <span className="font-medium">{totalReactions}</span>
                  </span>
                )}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {localCommentsCount} comments
            </span>
          </div>

          {/* Comments - scrollable */}
          <div className="flex-1 overflow-y-auto">
            <PostComments
              postId={post.id}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
