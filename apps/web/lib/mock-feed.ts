import type { FeedPost, Story } from "@/types/feed";

export const stories: Story[] = [
  { id: "s1", name: "Nova", active: true },
  { id: "s2", name: "Echo", active: true },
  { id: "s3", name: "Kairo", active: false },
  { id: "s4", name: "Mira", active: true },
  { id: "s5", name: "Axel", active: false },
];

export const feedPosts: FeedPost[] = [
  {
    id: "p1",
    author: {
      name: "Nova Vale",
      handle: "@nova",
      avatarTone: "light",
      verified: true,
    },
    createdAt: "12m",
    content:
      "Tonight's drop is built around silence, contrast, and a sharper network layer.",
    media: {
      type: "image",
      src: "/feed/krx-grid.png",
      alt: "Monochrome KRX grid composition",
    },
    stats: {
      reactions: "12.8K",
      comments: "842",
      reposts: "1.9K",
    },
  },
  {
    id: "p2",
    author: {
      name: "KVARON Labs",
      handle: "@labs",
      avatarTone: "line",
      verified: true,
    },
    createdAt: "38m",
    content:
      "Feed alpha is moving fast: posts, stories, reactions, comments, reposts, and live layers first.",
    media: {
      type: "video",
      src: "/feed/krx-live.png",
      alt: "KRX live monochrome stage frame",
    },
    stats: {
      reactions: "8.4K",
      comments: "391",
      reposts: "734",
    },
  },
  {
    id: "p3",
    author: {
      name: "Mira North",
      handle: "@mira",
      avatarTone: "dark",
    },
    createdAt: "1h",
    content:
      "A minimal profile should still feel alive. Motion, spacing, and fast transitions do most of the talking.",
    media: {
      type: "image",
      src: "/feed/krx-panel.png",
      alt: "Futuristic monochrome social panel",
    },
    stats: {
      reactions: "5.1K",
      comments: "204",
      reposts: "488",
    },
  },
];
