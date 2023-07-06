import { constants } from '../constants.js';
import { MediaTransport, MediaWorker } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService } from './base.js';
import { RoomService } from './room.js';

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
    await Promise.all(
      transports.map(async (transport) => {
        try {
          await fetchApi({
            host: transport.worker.apiHost,
            port: transport.worker.apiPort,
            path:
              transport.type === constants.CONSUMER
                ? `/consumer_transports/:transportId`
                : `/producer_transports/:transportId`,
            method: 'DELETE',
            data: { transportId: transport.id },
          });
        } catch {}
        await this.entityManager
          .getRepository(MediaTransport)
          .remove(transport);
        await this.entityManager
          .getRepository(MediaWorker)
          .decrement({ id: transport.workerId }, 'transportCount', 1);

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
