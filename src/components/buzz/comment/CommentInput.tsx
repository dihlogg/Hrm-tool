import React, { useMemo, useState } from "react";
import { Avatar, Button, Mentions } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { useGetAllEmployees } from "@/hooks/employees/useGetAllEmployees";

interface CommentInputProps {
  avatarUrl?: string | null;
  placeholder?: string;
  onSubmit: (content: string, mentionedIds: string[]) => Promise<void>;
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
  const { employees } = useGetAllEmployees();

  const mentionOptions = useMemo(() => {
    if (!employees) return [];
    return employees.map((emp) => {
      const isValidImage =
        emp.imageUrl && emp.imageUrl.trim() !== "" && emp.imageUrl !== "string";
      return {
        value: `${emp.firstName || ""}${emp.lastName || ""}`.replace(
          /\s+/g,
          "",
        ),
        label: (
          <div className="flex items-center h-10 gap-2 overflow-hidden">
            <Avatar
              src={isValidImage ? emp.imageUrl : undefined}
              size="small"
              icon={<UserOutlined />}
              className="flex-shrink-0"
            />
            <span className="font-medium text-gray-700 truncate">
              {emp.firstName} {emp.lastName}
            </span>
          </div>
        ),
        key: emp.id,
      };
    });
  }, [employees]);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    const mentionedIds: string[] = [];
    employees.forEach((emp) => {
      const mentionValue =
        `${emp.firstName || ""}${emp.lastName || ""}`.replace(/\s+/g, "");
      const mentionTag = `@${mentionValue}`;
      if (text.includes(mentionTag) && emp.id) {
        mentionedIds.push(emp.id);
      }
    });

    await onSubmit(text, mentionedIds);
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
        <Mentions
          value={text}
          onChange={(val) => setText(val)}
          options={mentionOptions}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              const mentionPopup = document.querySelector(
                ".ant-mentions-dropdown",
              );
              const isPopupOpen =
                mentionPopup &&
                (mentionPopup as HTMLElement).offsetParent !== null;

              if (!isPopupOpen) {
                e.preventDefault();
                handleSubmit();
              }
            }
          }}
          placeholder={placeholder}
          autoSize={{ minRows: 1, maxRows: 4 }}
          autoFocus={autoFocus}
          variant="borderless"
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
