import React from "react";
import {
  LikeFilled,
  HeartFilled,
  SmileFilled,
  StarFilled,
  FrownFilled,
  FireFilled,
} from "@ant-design/icons";

export const REACTION_TYPES = {
  LIKE: "LIKE",
  LOVE: "LOVE",
  HAHA: "HAHA",
  WOW: "WOW",
  SAD: "SAD",
  ANGRY: "ANGRY",
} as const;

export type ReactionType = keyof typeof REACTION_TYPES;

export const REACTION_MAP: Record<
  ReactionType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  LIKE: { label: "Like", icon: <LikeFilled />, color: "text-blue-600" },
  LOVE: { label: "Love", icon: <HeartFilled />, color: "text-red-600" },
  HAHA: { label: "Haha", icon: <SmileFilled />, color: "text-yellow-500" },
  WOW: { label: "Wow", icon: <StarFilled />, color: "text-yellow-500" },
  SAD: { label: "Sad", icon: <FrownFilled />, color: "text-yellow-500" },
  ANGRY: { label: "Angry", icon: <FireFilled />, color: "text-orange-600" },
};

export const REACTION_LIST = Object.entries(REACTION_MAP).map(
  ([key, value]) => ({
    type: key as ReactionType,
    ...value,
  }),
);
