import { cn } from "@/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClass = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  danger: "border border-red-900 text-red-400 hover:bg-red-950 hover:border-red-700 transition-colors",
};

const sizeClass = {
  sm: "px-3 py-1 text-xs rounded-xl",
  md: "px-4 py-1.5 text-sm rounded-xl",
  lg: "px-5 py-2.5 text-sm rounded-2xl",
};

export function Button({ variant = "ghost", size = "md", children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(variantClass[variant], sizeClass[size], "font-semibold cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  );
}
