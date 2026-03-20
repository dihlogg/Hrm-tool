"use client";

import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  currentSlide?: number;
  slideCount?: number;
}

export const CustomPrevArrow = (props: ArrowProps) => {
  const { onClick, currentSlide } = props;
  if (currentSlide === 0) return null;

  return (
    <div
      onClick={onClick}
      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100"
    >
      <LeftOutlined style={{ fontSize: "16px", color: "#4B5563" }} />
    </div>
  );
};

export const CustomNextArrow = (props: ArrowProps) => {
  const { onClick, currentSlide, slideCount } = props;
  if (slideCount && currentSlide === slideCount - 1) return null;

  return (
    <div
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100"
    >
      <RightOutlined style={{ fontSize: "16px", color: "#4B5563" }} />
    </div>
  );
};
