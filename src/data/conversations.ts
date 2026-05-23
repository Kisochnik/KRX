import type { Conversation } from "@/types";
import { MOCK_USERS } from "./users";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    user: MOCK_USERS.nova_sync,
    lastMessage: "That KRX protocol update is insane 🚀",
    lastTime: "2m",
    unreadCount: 3,
    messages: [
      { id: "m1", from: "them", text: "Hey! Did you see the new KRX update?", time: "10:01", read: true },
      { id: "m2", from: "me", text: "Yes! The speed improvements are insane", time: "10:02", read: true },
      { id: "m3", from: "them", text: "That KRX protocol update is insane 🚀", time: "10:04", read: false },
    ],
  },
  {
    id: "c2",
    user: MOCK_USERS.arc_lyra,
    lastMessage: "Can you share the docs link?",
    lastTime: "18m",
    unreadCount: 0,
    messages: [
      { id: "m4", from: "them", text: "Hey, working on the new decentralized identity spec", time: "9:30", read: true },
      { id: "m5", from: "me", text: "Sounds exciting! What's the approach?", time: "9:32", read: true },
      { id: "m6", from: "them", text: "Can you share the docs link?", time: "9:45", read: true },
    ],
  },
  {
    id: "c3",
    user: MOCK_USERS.hex_drift,
    lastMessage: "Let's collab on the next sprint",
    lastTime: "1h",
    unreadCount: 1,
    messages: [
      { id: "m7", from: "them", text: "The new component library looks great", time: "8:00", read: true },
      { id: "m8", from: "them", text: "Let's collab on the next sprint", time: "8:05", read: false },
    ],
  },
  {
    id: "c4",
    user: MOCK_USERS.void_px,
    lastMessage: "Nice work on the UI concept!",
    lastTime: "3h",
    unreadCount: 0,
    messages: [
      { id: "m9", from: "them", text: "Nice work on the UI concept!", time: "Yesterday", read: true },
    ],
  },
  {
    id: "c5",
    user: MOCK_USERS.krx_official,
    lastMessage: "Welcome to KVARON_X!",
    lastTime: "2d",
    unreadCount: 0,
    messages: [
      { id: "m10", from: "them", text: "Welcome to KVARON_X!", time: "2 days ago", read: true },
    ],
  },
];
