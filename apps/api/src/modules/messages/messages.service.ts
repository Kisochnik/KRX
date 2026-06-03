import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "../../entities/message.entity";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messages: Repository<Message>,
  ) {}

  send(senderId: string, dto: CreateMessageDto) {
    const message = this.messages.create({
      senderId,
      recipientId: dto.recipientId,
      body: dto.body,
    });

    return this.messages.save(message);
  }

  inbox(userId: string) {
    return this.messages.find({
      where: [{ recipientId: userId }, { senderId: userId }],
      order: {
        createdAt: "DESC",
      },
      take: 50,
    });
  }
}
