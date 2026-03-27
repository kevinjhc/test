import React from "react";
import { IconPlus, IconMessageCircle } from "@tabler/icons-react";

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
  { id: "9", title: "Privacy Policy Review", timestamp: "1mo ago" },
  { id: "10", title: "Terms of Service Update", timestamp: "1mo ago" },
];

interface ChatsPageProps {
  onNewChat?: () => void;
  onSelectChat?: (id: string, title: string) => void;
}

export function ChatsPage({ onNewChat, onSelectChat }: ChatsPageProps) {
  return (
    <div className="h-full flex flex-col overflow-y-scroll ">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Chats</h1>
          <button
            onClick={onNewChat}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <IconPlus size={16} />
            New Chat
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {mockChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <IconMessageCircle size={40} strokeWidth={1.5} />
              <p className="text-sm">No chats yet. Start a new one above.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {mockChats.map((chat) => (
                <button
                  key={chat.id + chat.title}
                  onClick={() => onSelectChat?.(chat.id, chat.title)}
                  className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors rounded-xl px-3 -mx-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                      <IconMessageCircle size={16} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {chat.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-4">
                    {chat.timestamp}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatsPage;
