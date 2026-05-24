import { users, getUserById, CURRENT_USER_ID } from "@/lib/data";
import type { User } from "@/lib/types";

export const userRepository = {
  getAll(): User[] {
    return users;
  },

  getById(id: string): User | undefined {
    return getUserById(id);
  },

  getCurrent(): User | undefined {
    return getUserById(CURRENT_USER_ID);
  },

  getOnline(): User[] {
    return users.filter((u) => u.status === "online");
  },

  getSuggested(excludeId: string, limit = 4): User[] {
    return users.filter((u) => u.id !== excludeId).slice(0, limit);
  },
};
