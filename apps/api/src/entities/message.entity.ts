import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "messages" })
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "sender_id", type: "uuid" })
  senderId: string;

  @ManyToOne(() => User, (user) => user.sentMessages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @Column({ name: "recipient_id", type: "uuid" })
  recipientId: string;

  @ManyToOne(() => User, (user) => user.receivedMessages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "recipient_id" })
  recipient: User;

  @Column({ type: "text" })
  body: string;

  @Column({ name: "read_at", type: "timestamptz", nullable: true })
  readAt?: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
