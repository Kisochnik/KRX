import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Friend } from "./friend.entity";
import { Like } from "./like.entity";
import { Message } from "./message.entity";
import { Notification } from "./notification.entity";
import { Post } from "./post.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ name: "password_hash", select: false })
  passwordHash: string;

  @Column({ name: "birth_date", type: "date" })
  birthDate: string;

  @Column({ name: "email_verified", default: false })
  emailVerified: boolean;

  @Column({ name: "email_verification_code_hash", nullable: true, select: false })
  emailVerificationCodeHash?: string | null;

  @Column({ name: "email_verification_expires_at", type: "timestamptz", nullable: true })
  emailVerificationExpiresAt?: Date | null;

  @Column({ name: "two_factor_enabled", default: false })
  twoFactorEnabled: boolean;

  @Column({ name: "two_factor_secret_hash", nullable: true, select: false })
  twoFactorSecretHash?: string | null;

  @Column({ default: "user" })
  role: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.recipient)
  receivedMessages: Message[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Friend, (friend) => friend.requester)
  sentFriendRequests: Friend[];

  @OneToMany(() => Friend, (friend) => friend.receiver)
  receivedFriendRequests: Friend[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
