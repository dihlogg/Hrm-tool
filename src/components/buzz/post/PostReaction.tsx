"use client";

import React, { useState, useRef, useEffect } from "react";

import { useToggleReaction } from "@/hooks/social/reaction/useToggleReaction";
import {
  REACTION_LIST,
  REACTION_MAP,
  REACTION_TYPES,
  ReactionType,
} from "../reaction/ReactionConstants";
import { LikeOutlined } from "@ant-design/icons";

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
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPanel(false);
    }, 100);
  };

  const handleMainBtnClick = async () => {
    if (loading) return;
    const typeToTrigger = myReaction ? myReaction : REACTION_TYPES.LIKE;
    await performReaction(typeToTrigger);
  };

  const handleSelectReaction = async (type: ReactionType) => {
    setShowPanel(false);
    if (loading) return;
    await performReaction(type);
  };

  const performReaction = async (type: string) => {
    try {
      await toggleReaction({ postId: postId, reactionType: type });

      const newReaction = myReaction === type ? null : type;

      if (onReactionChanged) onReactionChanged(newReaction);
    } catch (error) {
      console.error("Reaction failed", error);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const currentReactInfo = myReaction
    ? REACTION_MAP[myReaction as ReactionType]
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
          className="absolute z-10 flex items-center gap-1 p-1.5 mb-2 bg-white border rounded-full shadow-xl reaction-panel bottom-full left-0"
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          }}
        >
          {REACTION_LIST.map((react, index) => (
            <button
              key={react.type}
              onClick={() => handleSelectReaction(react.type)}
              className="flex flex-col items-center reaction-icon-btn animate-pop-in group"
              title={react.label}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-3xl transition-transform hover:scale-110 md:text-4xl">
                {react.icon}
              </span>
              <span className="absolute px-2 py-0.5 text-xs text-white transition-opacity bg-gray-800 rounded opacity-0 -top-7 group-hover:opacity-100 whitespace-nowrap">
                {react.label}
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleMainBtnClick}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        } ${showPanel ? "bg-gray-100" : ""}`}
      >
        {currentReactInfo ? (
          <div className="flex items-center gap-2 btn-reacted animate-pushClick">
            <span className="text-2xl">{currentReactInfo.icon}</span>
            <span className={`font-semibold ${currentReactInfo.color}`}>
              {currentReactInfo.label}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="flex items-center text-2xl">
              <LikeOutlined />
            </span>
            <span className="font-semibold">Like</span>
          </div>
        )}
      </button>
    </div>
  );
};
