import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/_app/bookmarks")({ component: BookmarksPage });

function BookmarksPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Bookmarks</h1>
      <div className="krx-card p-12 text-center">
        <Bookmark className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Posts you bookmark will appear here.</p>
      </div>
    </div>
  );
}
