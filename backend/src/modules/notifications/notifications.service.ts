import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationCategory, UserRole } from '../../common/enums';
import { UserEntity } from '../auth/entities/user.entity';

interface SendNotificationInput {
  category: NotificationCategory;
  title: string;
  body: string;
  referenceId?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private gateway: { sendToUser: (userId: string, event: string, data: unknown) => void } | null = null;

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifRepo: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  /** Allow WebSocket gateway to register itself for live push */
  setGateway(gw: { sendToUser: (userId: string, event: string, data: unknown) => void }) {
    this.gateway = gw;
  }

  /** Send notification to a specific user */
  async sendToUser(userId: string, input: SendNotificationInput): Promise<void> {
    const notification = await this.notifRepo.save({
      userId,
      category: input.category,
      title: input.title,
      body: input.body,
      read: false,
    });

    // Push to online user via WebSocket
    if (this.gateway) {
      this.gateway.sendToUser(userId, 'notification:new', {
        id: notification.id,
        category: notification.category,
        title: notification.title,
        body: notification.body,
      });
    }
  }

  /** Send notification to all MODERATOR users */
  async notifyModerators(input: SendNotificationInput): Promise<void> {
    const moderators = await this.userRepo.find({
      where: { role: UserRole.MODERATOR },
      select: ['id'],
    });
    await Promise.all(moderators.map((m) => this.sendToUser(m.id, input)));
  }

  /** Send notification to all ADMIN users */
  async notifyAdmins(input: SendNotificationInput): Promise<void> {
    const admins = await this.userRepo.find({
      where: { role: UserRole.ADMIN },
      select: ['id'],
    });
    await Promise.all(admins.map((a) => this.sendToUser(a.id, input)));
  }

  /** Get paginated notifications for a user */
  async getNotifications(userId: string, page: number, limit: number) {
    const [items, total] = await this.notifRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  /** Mark notifications as read */
  async markRead(userId: string, notificationIds: string[]): Promise<void> {
    await this.notifRepo.update(
      notificationIds.map((id) => ({ id, userId })).reduce(() => ({ userId }), { userId }),
      { read: true },
    );
  }
}
