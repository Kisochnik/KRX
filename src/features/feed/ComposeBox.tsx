"use client";
import { useState } from "react";
import { MOCK_USERS } from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";

interface ComposeBoxProps {
  onPost?: (text: string) => void;
}

export function ComposeBox({ onPost }: ComposeBoxProps) {
  const [text, setText] = useState("");
  const me = MOCK_USERS.me;
  const MAX = 280;
  const remaining = MAX - text.length;
  const isOverLimit = remaining < 0;
  const canPost = text.trim().length > 0 && !isOverLimit;

  const handlePost = () => {
    if (!canPost) return;
    onPost?.(text);
    setText("");
  };

  return (
    <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="flex gap-3">
        <Avatar user={me} size="md" ring />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full bg-transparent resize-none text-sm leading-relaxed py-1"
            style={{ color: "var(--text-primary)", minHeight: 64 }}
            placeholder="What's happening in the KRX universe?"
          />
          {/* Divider */}
          <div className="border-t mt-2 mb-3" style={{ borderColor: "var(--border)" }} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[
                ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "Image"],
                ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", "Link"],
                ["M18 20 18 10 M12 20 12 4 M6 20 6 14", "Poll"],
                ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0", "Location"],
              ].map(([path, label]) => (
                <button key={label} title={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
                  style={{ color: "var(--krx-blue)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {path.split(" M").map((p, i) => <path key={i} d={i === 0 ? p : "M" + p} />)}
                  </svg>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {text.length > 0 && (
                <div className="relative w-6 h-6">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 -rotate-90">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="var(--border)" strokeWidth="2" />
                    <circle cx="12" cy="12" r="10" fill="none"
                      stroke={isOverLimit ? "#ef4444" : remaining < 40 ? "#f59e0b" : "var(--krx-blue)"}
                      strokeWidth="2"
                      strokeDasharray={`${Math.min((text.length / MAX) * 62.83, 62.83)} 62.83`}
                      strokeLinecap="round"
                    />
                  </svg>
                  {remaining < 40 && (
                    <span className="absolute inset-0 flex items-center justify-center"
                          style={{ fontSize: 8, color: isOverLimit ? "#ef4444" : "var(--text-secondary)" }}>
                      {remaining}
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={handlePost}
                disabled={!canPost}
                className="btn-primary px-4 py-1.5 text-xs font-bold rounded-full"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
