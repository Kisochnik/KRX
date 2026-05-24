"use client";

import { Image, Smile, BarChart2, Calendar, MapPin } from "lucide-react";
import { Avatar, Button, IconButton } from "@/ui";
import { useLanguage } from "@/hooks";
import { userRepository } from "@/lib/repositories";

const composeActions = [
  { icon: Image, key: "photo" },
  { icon: Smile, key: "emoji" },
  { icon: BarChart2, key: "poll" },
  { icon: Calendar, key: "event" },
  { icon: MapPin, key: "place" },
] as const;

export function ComposeBox() {
  const { t } = useLanguage();
  const user = userRepository.getCurrent();

  return (
    <div className="border-b border-white/[0.06] px-4 py-5 lg:px-6">
      <div className="flex gap-4">
        {user && (
          <Avatar
            initials={user.avatar}
            size="md"
            status={user.status}
            showStatus
          />
        )}
        <div className="flex-1">
          <textarea
            placeholder={t.feed.compose}
            rows={2}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-white placeholder:text-white/35 outline-none"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex gap-0.5">
              {composeActions.map(({ icon, key }) => (
                <IconButton key={key} icon={icon} label={key} />
              ))}
            </div>
            <Button size="md">{t.feed.publish}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
