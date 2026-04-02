import React, { useEffect, useRef, useState } from "react";
import {
  IconMessageCircle,
  IconSend,
  IconUpload,
  IconUserPlus,
} from "@tabler/icons-react";

interface ChatItem {
  id: string;
  title: string;
  timestamp: string;
}

const mockChats: ChatItem[] = [
  { id: "1", title: "Contract Review - Q4 2025", timestamp: "2h ago" },
  { id: "2", title: "NDA Questions", timestamp: "1d ago" },
  { id: "3", title: "Employment Agreement", timestamp: "3d ago" },
  { id: "4", title: "Lease Agreement Review", timestamp: "1w ago" },
  { id: "5", title: "IP Assignment Clause", timestamp: "1w ago" },
  { id: "6", title: "Vendor MSA Review", timestamp: "2w ago" },
  { id: "7", title: "Contractor Agreement", timestamp: "2w ago" },
  { id: "8", title: "Equity Grant Questions", timestamp: "3w ago" },
];

interface NewChatPageProps {
  onSelectChat?: (id: string, title: string) => void;
}

export function NewChatPage({ onSelectChat }: NewChatPageProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const maxHeight = 200;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [input]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Centered compose area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
        <div className="w-full max-w-2xl">
          <div className="text-left mb-8">
            <h2 className="text-3xl text-gray-800 font-light mb-2">
              How can I help?
            </h2>
            <p className="text-md text-gray-500">
              Ask me about your contracts, documents, or recent conversations
              with your legal team.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-gray-200 p-4 flex flex-col gap-4">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask questions about your contracts..."
              aria-label="New chat input"
              rows={1}
              className="w-full resize-none bg-transparent focus:outline-none text-md text-gray-600 placeholder-gray-400"
              style={{ maxHeight: `${maxHeight}px` }}
            />

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <IconUpload size={16} />
                  Upload file
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <IconUserPlus size={16} />
                  Chat with your lawyer
                </button>
              </div>
              <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 cursor-pointer">
                <IconSend size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Peeking chat history */}
      <div className="flex-shrink-0 w-full max-w-2xl mx-auto pb-0">
        <div className="border border-gray-200 rounded-t-2xl overflow-hidden">
          {/* Show just enough rows to peek — no scroll */}
          <div className="bg-white divide-y divide-gray-100">
            {mockChats.slice(0, 4).map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat?.(chat.id, chat.title)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer text-left group"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                  <IconMessageCircle size={14} className="text-gray-500" />
                </div>
                <span className="flex-1 text-sm text-gray-800 truncate">
                  {chat.title}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {chat.timestamp}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewChatPage;
