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
import "@/styles/reaction.css";

interface CommentReactionProps {
  postCommentId: string;
  myReaction?: string | null;
  onReactionChanged?: (newReaction: string | null) => void;
}

export const CommentReaction: React.FC<CommentReactionProps> = ({
  postCommentId,
  myReaction,
  onReactionChanged,
}) => {
  const { toggleReaction, loading } = useToggleReaction();
  const [showPanel, setShowPanel] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (loading) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setShowPanel(true), 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setShowPanel(false), 400);
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
      await toggleReaction({ postCommentId: postCommentId, reactionType: type });
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
        <div className="reaction-panel absolute z-50 flex items-center gap-1.5 px-2 py-1 mb-1 bg-white border border-gray-100 rounded-[30px] shadow-lg bottom-full -left-4 animate-pop-in">
          {REACTION_LIST.map((react) => (
            <button
              key={react.type}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectReaction(react.type);
              }}
              className="relative flex flex-col items-center justify-center transition-all duration-300 ease-out origin-bottom cursor-pointer reaction-icon-btn group"
              title={react.label}
            >
              <div className="flex items-center justify-center pointer-events-none [&>img]:!w-8 [&>img]:!h-8">
                {react.icon}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Text Button */}
      <span
        onClick={handleMainBtnClick}
        className={`font-bold cursor-pointer hover:underline ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        } ${currentReactInfo ? currentReactInfo.color : "text-gray-500"}`}
      >
        {currentReactInfo ? currentReactInfo.label : "Like"}
      </span>
    </div>
  );
};
