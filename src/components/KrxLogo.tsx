interface Props {
  className?: string;
  showText?: boolean;
}

export function KrxLogo({ className = "", showText = true }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
        <span className="text-background font-bold text-sm tracking-tighter">X</span>
        <div className="absolute -inset-0.5 rounded-lg bg-foreground/20 blur-sm -z-10" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold tracking-[0.2em]">KVARON_X</span>
          <span className="text-[10px] text-muted-foreground tracking-[0.3em]">KRX</span>
        </div>
      )}
    </div>
  );
}
