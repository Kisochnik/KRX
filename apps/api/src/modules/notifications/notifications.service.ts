import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "../../entities/notification.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifications: Repository<Notification>,
  ) {}

  list(userId: string) {
    return this.notifications.find({
      where: { userId },
      order: {
        createdAt: "DESC",
      },
      take: 50,
    });
  }
}
