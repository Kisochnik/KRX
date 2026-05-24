import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { VerifiedBadge } from "./VerifiedBadge";
import type { User } from "@/lib/types";

interface UserRowProps {
  user: User;
  actionLabel?: string;
  onAction?: () => void;
  showStatus?: boolean;
}

export function UserRow({
  user,
  actionLabel = "Читать",
  onAction,
  showStatus = true,
}: UserRowProps) {
  return (
    <li className="flex items-center gap-3">
      <Avatar
        initials={user.avatar}
        size="md"
        status={user.status}
        showStatus={showStatus}
      />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 truncate text-sm font-semibold">
          {user.displayName}
          {user.verified && <VerifiedBadge />}
        </p>
        <p className="truncate text-xs text-white/40">@{user.username}</p>
      </div>
      {onAction !== undefined && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </li>
  );
}
