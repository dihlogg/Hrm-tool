import React, { useState } from "react";
import { Avatar, Button, Input } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";

interface CommentInputProps {
  avatarUrl?: string | null;
  placeholder?: string;
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
  autoFocus?: boolean;
  size?: number;
}

export const CommentInput = ({
  avatarUrl,
  placeholder = "Write a comment",
  onSubmit,
  isLoading = false,
  autoFocus = false,
  size = 36,
}: CommentInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await onSubmit(text);
    setText("");
  };

  return (
    <div className="flex items-start gap-2 mt-2 animate-fade-in">
      <Avatar
        src={avatarUrl || undefined}
        icon={!avatarUrl && <UserOutlined />}
        size={size}
        className="mt-1"
      />
      <div className="flex flex-col flex-1 bg-[#F0F2F5] rounded-2xl relative px-3 py-1">
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          autoSize={{ minRows: 1, maxRows: 4 }}
          autoFocus={autoFocus}
          className="!bg-transparent !border-none !shadow-none focus:!ring-0 text-[14px] text-[#050505] p-1"
          disabled={isLoading}
        />
        <div className="flex justify-end pb-1">
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={
              <SendOutlined
                className={text.trim() ? "text-blue-500" : "text-gray-400"}
              />
            }
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!text.trim()}
          />
        </div>
      </div>
    </div>
  );
};
