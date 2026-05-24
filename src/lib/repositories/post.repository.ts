import { posts } from "@/lib/data";
import type { Post } from "@/lib/types";

export const postRepository = {
  getAll(): Post[] {
    return posts;
  },

  getByAuthor(authorId: string): Post[] {
    return posts.filter((p) => p.authorId === authorId);
  },

  getById(id: string): Post | undefined {
    return posts.find((p) => p.id === id);
  },
};
