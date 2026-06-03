export type FeedTab = "For You" | "Following" | "KRX Live";

export type FeedPost = {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarTone: "light" | "dark" | "line";
    verified?: boolean;
  };
  createdAt: string;
  content: string;
  media?: {
    type: "image" | "video";
    src: string;
    alt: string;
  };
  stats: {
    reactions: number;
    comments: number;
    reposts: number;
  };
};

export type Story = {
  id: string;
  name: string;
  active: boolean;
};
