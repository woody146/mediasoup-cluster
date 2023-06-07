import { MediasoupRoom } from '../entities';
import { BaseService } from './base';

export class MediasoupRoomService extends BaseService {
  async add(data: { metadata?: any }) {
    const mediasoupRoom = new MediasoupRoom();
    Object.assign(mediasoupRoom, data);
    await this.dataSource.getRepository(MediasoupRoom).save(mediasoupRoom);
    return mediasoupRoom.id;
  }
}
