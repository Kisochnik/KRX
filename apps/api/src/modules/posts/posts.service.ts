import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../../entities/post.entity";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly posts: Repository<Post>,
  ) {}

  create(authorId: string, dto: CreatePostDto) {
    const post = this.posts.create({
      authorId,
      content: dto.content,
      mediaUrl: dto.mediaUrl,
      mediaType: dto.mediaType,
    });

    return this.posts.save(post);
  }

  feed() {
    return this.posts.find({
      relations: {
        author: true,
      },
      order: {
        createdAt: "DESC",
      },
      take: 50,
    });
  }
}
