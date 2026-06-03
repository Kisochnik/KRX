import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  leftIcon?: ReactNode;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, leftIcon, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block w-full" htmlFor={inputId}>
        {label ? (
          <span className="mb-2 block text-sm font-medium text-white">
            {label}
          </span>
        ) : null}
        <span
          className={cn(
            "flex h-12 items-center gap-3 rounded-md border border-[#2a2a2a] bg-[#0b0b0b] px-3 text-white transition duration-200 focus-within:border-white",
            error && "border-white",
          )}
        >
          {leftIcon ? <span className="text-neutral-400">{leftIcon}</span> : null}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500",
              className,
            )}
            {...props}
          />
        </span>
        {error ? <span className="mt-2 block text-xs text-white">{error}</span> : null}
      </label>
    );
  },
);

Input.displayName = "Input";
