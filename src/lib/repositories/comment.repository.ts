import { getCommentsByPostId } from "@/lib/data";

export const commentRepository = {
  getByPostId(postId: string, limit = 2) {
    return getCommentsByPostId(postId).slice(0, limit);
  },

  getCount(postId: string) {
    return getCommentsByPostId(postId).length;
  },
};
