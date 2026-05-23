import type { Notification } from "@/types";
import { MOCK_USERS } from "./users";

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "like", fromUser: MOCK_USERS.nova_sync, text: "liked your post about KRX protocol", createdAt: "2m", read: false },
  { id: "n2", type: "follow", fromUser: MOCK_USERS.arc_lyra, text: "started following you", createdAt: "14m", read: false },
  { id: "n3", type: "mention", fromUser: MOCK_USERS.hex_drift, text: "mentioned you: \"@kvaron_x nailed it again\"", createdAt: "1h", read: false },
  { id: "n4", type: "repost", fromUser: MOCK_USERS.void_px, text: "reposted your \"dark mode is a philosophy\" post", createdAt: "2h", read: false },
  { id: "n5", type: "like", fromUser: MOCK_USERS.krx_official, text: "liked your profile update", createdAt: "3h", read: true },
  { id: "n6", type: "follow", fromUser: MOCK_USERS.sigma_node, text: "started following you", createdAt: "5h", read: true },
  { id: "n7", type: "mention", fromUser: MOCK_USERS.delta_flux, text: "replied: \"totally agree with this take\"", createdAt: "8h", read: true },
];
