"use client";

import { Image, Smile, BarChart2, MapPin, Mic } from "lucide-react";
import { Avatar, Button, IconButton, GlassPanel } from "@/ui";
import { useLanguage } from "@/hooks";
import { userRepository } from "@/lib/repositories";

export function ComposeBox() {
  const { t } = useLanguage();
  const user = userRepository.getCurrent();

  return (
    <GlassPanel
      padding="none"
      className="mx-4 my-4 overflow-hidden !rounded-2xl lg:mx-6"
    >
      <div className="flex gap-4 p-4">
        {user && (
          <Avatar initials={user.avatar} size="md" status={user.status} showStatus />
        )}
        <div className="flex-1">
          <textarea
            placeholder={t.feed.compose}
            rows={2}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-white placeholder:text-white/35 outline-none"
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
        <div className="flex gap-0.5">
          {[Image, Smile, BarChart2, MapPin, Mic].map((Icon, i) => (
            <IconButton key={i} icon={Icon} label="action" />
          ))}
        </div>
        <Button size="md">{t.feed.publish}</Button>
      </div>
    </GlassPanel>
  );
}
