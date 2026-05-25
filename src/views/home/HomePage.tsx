"use client";

import { AppShell, ScrollArea } from "@/layouts";
import { FeedHeader, Stories, ComposeBox, PostCard } from "@/components/feed";
import { PostCardSkeleton } from "@/ui";
import { postRepository } from "@/lib/repositories";
import { usePageLoading } from "@/hooks/usePageLoading";

export function HomePage() {
  const loading = usePageLoading(500);
  const posts = postRepository.getAll();

  return (
    <AppShell showRightPanel>
      <FeedHeader />
      <ScrollArea>
        <Stories />
        {!loading && <ComposeBox />}
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))
          : posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
      </ScrollArea>
    </AppShell>
  );
}
