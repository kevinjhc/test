import React, { useEffect, useRef, useState } from "react";
import { IconSend, IconMessageCircle, IconUpload, IconUserPlus } from "@tabler/icons-react";

interface ChatPageProps {
  chatId?: string | null;
  title?: string | null;
}

export function ChatPage({ chatId, title }: ChatPageProps) {
  const isEmpty = !chatId;
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const maxHeight = 140; // px

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [input]);

  return (
    <div className="h-full relative flex flex-col">
      {/* Full-width header with bottom border */}
      <header className="w-full border-b border-gray-200 px-5 md:px-6 py-4">
        <h1 className="text-base font-semibold">{title ?? "Chat"}</h1>
      </header>

      {/* Body - existing conversation content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-6">
          <div className="space-y-6">
            {/* Sample responses */}
            <div className="bg-gray-100 p-6 rounded-xl mr-16">
              <div className="text-md text-gray-700">
                Hello! Welcome to the General Legal client portal. 👋<br />
                <br />
                I'm your AI legal assistant, and I can help you with a few things:<br />
                <br />
                📄 View your contracts — see what's on file and check details or document contents<br />
                💬 Check Slack conversations — review recent messages or search for specific topics discussed with your legal team<br />
                📝 Review uploaded documents — read and add comments to documents you upload here<br />
                <br />
                What can I help you with today?
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 ml-16">
              <div className="text-md text-gray-700">Hello there</div>
            </div>
          </div>
        </div>
      </div>

      {/* LLM input at bottom, centered with max width */}
      <div className="w-full p-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border-2 border-gray-200 p-4 flex items-center justify-between gap-4">
            <div className="flex-1 gap-4 flex flex-col">
              
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask questions about your contracts..."
                  aria-label="Chat input"
                  rows={1}
                  className="w-full resize-none bg-transparent focus:outline-none text-md text-gray-600 placeholder-gray-400"
                  style={{ maxHeight: `${maxHeight}px` }}
                />
              

              <div className="flex">
                <div className="flex flex-1 gap-3">
                    <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                    <IconUpload size={16} />
                    Upload file
                    </button>
                    <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                    <IconUserPlus size={16} />
                    Chat with your lawyer
                    </button>
                </div>

                <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800">
                    <IconSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
