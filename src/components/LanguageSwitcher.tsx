import { Globe } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const langs: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ua", label: "Українська" },
  { code: "ru", label: "Русский" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const current = langs.find((l) => l.code === lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Globe className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wider">{current?.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {langs.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={lang === l.code ? "bg-accent" : ""}
          >
            <span className="text-xs uppercase tracking-wider mr-2 text-muted-foreground">{l.code}</span>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
