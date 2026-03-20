import React from "react";

export const REACTION_TYPES = {
  LIKE: "LIKE",
  LOVE: "LOVE",
  CARE: "CARE",
  HAHA: "HAHA",
  WOW: "WOW",
  SAD: "SAD",
  ANGRY: "ANGRY",
} as const;

export type ReactionType = keyof typeof REACTION_TYPES;

const ReactionIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img
    src={src}
    alt={alt}
    width={48}
    height={48}
    style={{ width: 48, height: 48 }}
    className="object-contain shrink-0 drop-shadow-sm md:w-11 md:h-11"
  />
);

const LocalIcons = {
  Like: <ReactionIcon src="/reactions/like.png" alt="Like" />,
  Love: <ReactionIcon src="/reactions/love.png" alt="Love" />,
  Care: <ReactionIcon src="/reactions/care.png" alt="Care" />,
  Haha: <ReactionIcon src="/reactions/haha.png" alt="Haha" />,
  Wow: <ReactionIcon src="/reactions/wow.png" alt="Wow" />,
  Sad: <ReactionIcon src="/reactions/sad.png" alt="Sad" />,
  Angry: <ReactionIcon src="/reactions/angry.png" alt="Angry" />,
};

export const REACTION_MAP: Record<
  ReactionType,
  {
    label: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    color: string;
  }
> = {
  LIKE: {
    label: "Like",
    icon: LocalIcons.Like,
    activeIcon: LocalIcons.Like,
    color: "text-blue-600",
  },
  LOVE: {
    label: "Love",
    icon: LocalIcons.Love,
    activeIcon: LocalIcons.Love,
    color: "text-red-600",
  },
  CARE: {
    label: "Care",
    icon: LocalIcons.Care,
    activeIcon: LocalIcons.Care,
    color: "text-amber-500",
  },
  HAHA: {
    label: "Haha",
    icon: LocalIcons.Haha,
    activeIcon: LocalIcons.Haha,
    color: "text-yellow-500",
  },
  WOW: {
    label: "Wow",
    icon: LocalIcons.Wow,
    activeIcon: LocalIcons.Wow,
    color: "text-yellow-500",
  },
  SAD: {
    label: "Sad",
    icon: LocalIcons.Sad,
    activeIcon: LocalIcons.Sad,
    color: "text-yellow-500",
  },
  ANGRY: {
    label: "Angry",
    icon: LocalIcons.Angry,
    activeIcon: LocalIcons.Angry,
    color: "text-orange-600",
  },
};

export const REACTION_LIST = Object.entries(REACTION_MAP).map(
  ([key, value]) => ({
    type: key as ReactionType,
    ...value,
  }),
);

export const normalizeReactionType = (
  reactionType?: string | null,
): ReactionType | null => {
  if (!reactionType) return null;

  const normalized = reactionType.trim().toUpperCase() as ReactionType;
  return normalized in REACTION_MAP ? normalized : null;
};
