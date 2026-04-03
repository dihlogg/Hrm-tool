"use client";

import React, { useState, useRef, useEffect } from "react";
import { useToggleReaction } from "@/hooks/social/reaction/useToggleReaction";
import {
  REACTION_LIST,
  REACTION_MAP,
  REACTION_TYPES,
  ReactionType,
  normalizeReactionType,
} from "../reaction/ReactionConstants";
import { LikeOutlined } from "@ant-design/icons";
import styles from "@/styles/reaction.module.css";

interface PostReactionProps {
  postId: string;
  myReaction?: string | null;
  onReactionChanged?: (newReaction: string | null) => void;
}

export const PostReaction: React.FC<PostReactionProps> = ({
  postId,
  myReaction,
  onReactionChanged,
}) => {
  const { toggleReaction, loading } = useToggleReaction();
  const [showPanel, setShowPanel] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (loading) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPanel(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPanel(false);
    }, 400);
  };

  const handleMainBtnClick = async () => {
    if (loading) return;
    const normalizedCurrentReaction = normalizeReactionType(myReaction);
    const typeToTrigger = normalizedCurrentReaction ?? REACTION_TYPES.LIKE;
    await performReaction(typeToTrigger);
  };

  const handleSelectReaction = async (type: ReactionType) => {
    setShowPanel(false);
    if (loading) return;
    await performReaction(type);
  };

  const performReaction = async (type: string) => {
    const normalizedCurrentReaction = normalizeReactionType(myReaction);
    const previousReaction = normalizedCurrentReaction;
    const newReaction = normalizedCurrentReaction === type ? null : type;

    if (onReactionChanged) onReactionChanged(newReaction);

    try {
      await toggleReaction({ postId: postId, reactionType: type });
    } catch (error) {
      console.error("Reaction failed", error);
      if (onReactionChanged) onReactionChanged(previousReaction);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const normalizedCurrentReaction = normalizeReactionType(myReaction);
  const currentReactInfo = normalizedCurrentReaction
    ? REACTION_MAP[normalizedCurrentReaction]
    : null;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reaction Panel (Popup) */}
      {showPanel && (
        <div
          ref={panelRef}
          className={`${styles.reactionPanel} absolute z-10 flex items-center gap-1.5 px-3 py-2 mb-2 bg-white border border-gray-100 rounded-[30px] shadow-lg bottom-full left-0 ${styles.animatePopIn}`}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          }}
        >
          {REACTION_LIST.map((react, index) => (
            <button
              key={react.type}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectReaction(react.type);
              }}
              className={`${styles.reactionIconBtn} relative flex flex-col items-center justify-center transition-all duration-300 ease-out origin-bottom cursor-pointer group`}
              title={react.label}
            >
              <div className="flex items-center justify-center pointer-events-none">
                {react.icon}
              </div>

              <span className="absolute px-2.5 py-1 text-[11px] font-bold text-white bg-black/80 rounded-full opacity-0 -top-8 group-hover:opacity-100 whitespace-nowrap shadow-md pointer-events-none transition-opacity duration-200">
                {react.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Like Button */}
      <button
        onClick={handleMainBtnClick}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        } ${showPanel ? "bg-gray-100" : ""}`}
      >
        {currentReactInfo ? (
          <div className={`${styles.btnReacted} flex items-center gap-2`}>
            <span
              className={`text-xl flex items-center [&>img]:!w-6 [&>img]:!h-6 [&>img]:!min-w-[24px] [&>img]:!min-h-[24px] ${currentReactInfo.color}`}
            >
              {currentReactInfo.activeIcon}
            </span>
            <span className={`font-bold ${currentReactInfo.color}`}>
              {currentReactInfo.label}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 font-semibold text-gray-600">
            <span className="flex items-center text-xl">
              <LikeOutlined />
            </span>
            <span>Like</span>
          </div>
        )}
      </button>
    </div>
  );
};
