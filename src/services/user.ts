import { MediaTransport } from '../entities/index.js';
import { BaseService } from './base.js';
import { RoomService } from './room.js';
import { TransportService } from './transport.js';

export class UserService extends BaseService {
  /**
   * if data.roomId is not undefined, make user logout from this room.
   * Otherwise make user logout from all room.
   */
  async logout(data: { userId: string; roomId?: string }) {
    const transports = await this.entityManager
      .getRepository(MediaTransport)
      .find({
        relations: { worker: true },
        where: { userId: data.userId, roomId: data.roomId },
      });
    const transportService = this.createService(TransportService);

    await Promise.all(
      transports.map(async (transport) => {
        await transportService.closeTransport(transport);

        // this.removeEmptyRoom(transport);
      })
    );
    return {};
  }

  async removeEmptyRoom(data: { roomId: string }) {
    const exist = await this.entityManager
      .getRepository(MediaTransport)
      .findOne({
        select: { id: true },
        where: { roomId: data.roomId },
      });
    // if no one in room
    if (!exist) {
      this.createService(RoomService).close(data);
    }
  }
}
