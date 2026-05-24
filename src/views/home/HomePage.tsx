"use client";

import { AppShell, ScrollArea } from "@/layouts";
import {
  FeedHeader,
  Stories,
  ComposeBox,
  PostCard,
} from "@/components/feed";
import { postRepository } from "@/lib/repositories";
export function HomePage() {
  const posts = postRepository.getAll();

  return (
    <AppShell showRightPanel>
      <FeedHeader />
      <ScrollArea>
        <Stories />
        <ComposeBox />
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </ScrollArea>
    </AppShell>
  );
}
