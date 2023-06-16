import { constants } from '../constants.js';
import { MediaPeer } from '../entities/media.peer.js';
import { MediaWorker } from '../entities/media.worker.js';
import { fetchApi } from '../utils/api.js';
import { BaseService } from './base.js';

export class UserService extends BaseService {
  /**
   * if data.roomId is not undefined, make user logout from this room.
   * Otherwise make user logout from all room.
   */
  async logout(data: { userId: string; roomId?: string }) {
    const peers = await this.dataSource.getRepository(MediaPeer).find({
      relations: { worker: true },
      where: { userId: data.userId, roomId: data.roomId },
    });
    await Promise.all(
      peers.map(async (peer) => {
        try {
          await fetchApi({
            host: peer.worker.internalHost,
            port: peer.worker.apiPort,
            path:
              peer.type === constants.CONSUMER
                ? `/consumer_transports/:transportId`
                : `/producer_transports/:transportId`,
            method: 'DELETE',
            data: { transportId: peer.id },
          });
        } catch {}
        await this.dataSource.getRepository(MediaPeer).remove(peer);
        await this.dataSource
          .getRepository(MediaWorker)
          .decrement({ id: peer.workerId }, 'peerCount', 1);
      })
    );
    return {};
  }
}
