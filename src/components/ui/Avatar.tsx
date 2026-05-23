import type { User } from "@/types";

interface AvatarProps {
  user: User;
  size?: "sm" | "md" | "lg" | "xl";
  showOnline?: boolean;
  ring?: boolean;
  className?: string;
}

const sizeMap = {
  sm:  { outer: "w-7 h-7",  text: "text-xs" },
  md:  { outer: "w-10 h-10", text: "text-xs" },
  lg:  { outer: "w-12 h-12", text: "text-sm" },
  xl:  { outer: "w-20 h-20", text: "text-lg" },
};

const dotSizeMap = {
  sm:  "w-2 h-2",
  md:  "w-2.5 h-2.5",
  lg:  "w-3 h-3",
  xl:  "w-3.5 h-3.5",
};

export function Avatar({ user, size = "md", showOnline = false, ring = false, className = "" }: AvatarProps) {
  const s = sizeMap[size];
  const dotSize = dotSizeMap[size];

  const inner = (
    <div
      className={`${s.outer} rounded-full flex items-center justify-center font-bold border ${s.text} flex-shrink-0 ${className}`}
      style={{
        background: user.avatarColor + "20",
        color: user.avatarColor,
        borderColor: user.avatarColor + "40",
      }}
    >
      {user.avatar}
    </div>
  );

  return (
    <div className="relative flex-shrink-0">
      {ring ? (
        <div className="avatar-ring rounded-full flex-shrink-0">
          <div
            className={`${s.outer} rounded-full flex items-center justify-center font-bold ${s.text}`}
            style={{ background: "#111" }}
          >
            <span style={{ color: user.avatarColor }}>{user.avatar}</span>
          </div>
        </div>
      ) : inner}

      {showOnline && user.isOnline && (
        <span
          className={`absolute bottom-0 right-0 ${dotSize} rounded-full border-2 online-dot`}
          style={{ borderColor: "var(--bg-primary)" }}
        />
      )}
    </div>
  );
}
