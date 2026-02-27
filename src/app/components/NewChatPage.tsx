import React, { useEffect, useRef, useState } from "react";
import { IconMessageCircle, IconSend, IconUpload, IconUserPlus } from "@tabler/icons-react";

export function NewChatPage() {
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
    <div className="h-full relative flex flex-col">
      <div className="flex-1">
        <div className="mx-auto p-6 h-full flex flex-col items-center justify-center">
          <div className="w-full px-4">
            <div className="max-w-3xl mx-auto">

                <div className="text-left mb-8">
                    <h2 className="text-3xl text-gray-800 font-light mb-2">How can I help?</h2>
                    <p className="text-md text-gray-500">Ask me about your contracts, documents, or recent conversations with your legal team.</p>
                </div>
              <div className="rounded-xl border-2 border-gray-200 p-4 flex flex-col gap-4">
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
    </div>
  );
}

export default NewChatPage;
