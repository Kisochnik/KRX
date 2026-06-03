import { Avatar } from "@/components/ui/avatar";
import { stories } from "@/lib/mock-feed";

export function StoriesRow() {
  return (
    <div className="krx-scrollbar flex gap-4 overflow-x-auto border-b border-[#2a2a2a] pb-5">
      {stories.map((story) => (
        <div key={story.id} className="flex w-16 shrink-0 flex-col items-center gap-2">
          <span className={story.active ? "rounded-full border border-white p-0.5" : ""}>
            <Avatar name={story.name} size="lg" tone={story.active ? "light" : "dark"} />
          </span>
          <span className="max-w-16 truncate text-xs font-semibold text-neutral-300">
            {story.name}
          </span>
        </div>
      ))}
    </div>
  );
}
