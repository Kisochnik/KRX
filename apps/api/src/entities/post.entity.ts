import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { User } from "./user.entity";

export type PostMediaType = "image" | "video";

@Entity({ name: "posts" })
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "author_id", type: "uuid" })
  authorId: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author: User;

  @Column({ type: "text" })
  content: string;

  @Column({ name: "media_url", nullable: true })
  mediaUrl?: string;

  @Column({ name: "media_type", nullable: true })
  mediaType?: PostMediaType;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
