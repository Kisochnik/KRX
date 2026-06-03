import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@Entity({ name: "likes" })
@Index(["userId", "postId"], { unique: true })
export class Like {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "post_id", type: "uuid" })
  postId: string;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;
}
