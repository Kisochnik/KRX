import NextImage from "next/image";
import { cn } from "@/lib/cn";

type AvatarProps = {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark" | "line";
};

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
};

const toneClasses = {
  light: "border-white bg-white text-black",
  dark: "border-[#2a2a2a] bg-[#141414] text-white",
  line: "border-white bg-black text-white",
};

export function Avatar({ name, src, size = "md", tone = "dark" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <NextImage
        className={cn("rounded-full object-cover", sizeClasses[size])}
        src={src}
        alt={name}
        width={56}
        height={56}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-bold",
        sizeClasses[size],
        toneClasses[tone],
      )}
      aria-label={name}
    >
      {initials}
    </span>
  );
}
