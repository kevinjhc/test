import React, { useEffect, useRef, useState } from "react";
import {
  IconSend,
  IconUpload,
  IconUserPlus,
  IconDownload,
  IconFileTypeDocx,
} from "@tabler/icons-react";

interface ChatPageProps {
  chatId?: string | null;
  title?: string | null;
}

interface Attachment {
  name: string;
  type: string;
  size: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  senderName: string;
  time: string;
  text: string;
  badge?: string;
  attachment?: Attachment;
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "user",
    senderName: "Kevin",
    time: "9:10 AM",
    text: "I would like General Legal to review this NDA.",
    attachment: {
      name: "NDA - Client Name.docx",
      type: "DOCX",
      size: "856 KB",
    },
  },
  {
    id: "2",
    sender: "ai",
    senderName: "General Legal AI",
    badge: "LEGAL AI",
    time: "9:10 AM",
    text: "I received your file. I'm doing an initial AI review now to flag any common issues. This should take about 2 minutes. After that, a General Legal attorney will review your file and provide updates.",
  },
];

function UserAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
      {initial}
    </div>
  );
}

function AIAvatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0">
      {/* General Legal "GL" monogram */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="20" height="20" rx="4" fill="transparent" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="white"
          fontSize="9"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0"
        >
          GL
        </text>
      </svg>
    </div>
  );
}

function AttachmentCard({ attachment }: { attachment: Attachment }) {
  return (
    <div className="mt-3 inline-flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white max-w-xs">
      <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
        <IconFileTypeDocx size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {attachment.name}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {attachment.type} • {attachment.size}
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0">
        <IconDownload size={16} />
      </button>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isAI = message.sender === "ai";

  return (
    <div className="flex gap-4 px-6 py-5 max-w-5xl mx-auto">
      {isAI ? <AIAvatar /> : <UserAvatar name={message.senderName} />}
      <div className="flex-1 min-w-0">
        {/* Metadata row */}
        <div className="flex items-center gap-2">
          <span className="text-md font-semibold text-gray-900">
            {message.senderName}
          </span>
          {message.badge && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
              {message.badge}
            </span>
          )}
          <span className="text-xs text-gray-400">{message.time}</span>
        </div>

        {/* Message text */}
        <p className="text-base text-gray-700 leading-relaxed">
          {message.text}
        </p>

        {/* Attachment */}
        {message.attachment && (
          <AttachmentCard attachment={message.attachment} />
        )}
      </div>
    </div>
  );
}

export function ChatPage({ chatId, title }: ChatPageProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const maxHeight = 140;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      senderName: "Kevin",
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      text: input.trim(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-base font-semibold text-gray-900">
          {title ?? "Chat"}
        </h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-6 w-5xl mx-auto">
        <div className="rounded-3xl border-2 border-gray-200 p-4 flex flex-col gap-4">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask questions about your contracts..."
            aria-label="Chat input"
            rows={1}
            className="w-full resize-none bg-transparent focus:outline-none text-sm text-gray-600 placeholder-gray-400"
            style={{ maxHeight: `${maxHeight}px` }}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <IconUpload size={14} />
                Upload file
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <IconUserPlus size={14} />
                Chat with your lawyer
              </button>
            </div>
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer flex-shrink-0"
            >
              <IconSend size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
