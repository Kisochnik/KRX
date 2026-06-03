import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

export type FriendStatus = "pending" | "accepted" | "blocked";

@Entity({ name: "friends" })
@Index(["requesterId", "receiverId"], { unique: true })
export class Friend {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "requester_id", type: "uuid" })
  requesterId: string;

  @ManyToOne(() => User, (user) => user.sentFriendRequests, { onDelete: "CASCADE" })
  @JoinColumn({ name: "requester_id" })
  requester: User;

  @Column({ name: "receiver_id", type: "uuid" })
  receiverId: string;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, { onDelete: "CASCADE" })
  @JoinColumn({ name: "receiver_id" })
  receiver: User;

  @Column({ default: "pending" })
  status: FriendStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
