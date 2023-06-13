import { types } from 'mediasoup';
import { mediasoupWorkerManager } from './worker.js';
import { ServiceError } from '../base.js';
import { getDataSource } from '../../utils/datasource.js';
import { MediaRoom } from '../../entities/index.js';

class MediasoupRouterManager {
  static routers = new Map<string, types.Router>();

  async create() {
    const worker = mediasoupWorkerManager.getWorker();
    const mediaCodecs = JSON.parse(process.env.MEDIASOUP_MEDIA_CODECS || '{}');
    const router = await worker.createRouter({ mediaCodecs });
    router.observer.on('close', function () {
      MediasoupRouterManager.routers.delete(router.id);
      getDataSource()
        .createQueryBuilder(MediaRoom, 'MediaRoom')
        .delete()
        .from(MediaRoom)
        .where('routerId = :routerId', { routerId: router.id })
        .execute();
    });
    MediasoupRouterManager.routers.set(router.id, router);
    return {
      id: router.id,
      rtpCapabilities: router.rtpCapabilities,
    };
  }

  getRtpCapabilities(data: { routerId: string }) {
    const router = this.get(data.routerId);
    if (router) {
      return { rtpCapabilities: router.rtpCapabilities };
    }
    throw new ServiceError(404, 'Router not found');
  }

  get(id: string) {
    return MediasoupRouterManager.routers.get(id);
  }

  async delete(id: string) {
    const router = this.get(id);
    if (router) {
      router.close();
    }
  }
}

export const mediasoupRouterManager = new MediasoupRouterManager();
