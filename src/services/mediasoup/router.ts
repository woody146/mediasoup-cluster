import { types } from 'mediasoup';
import { mediasoupWorkerManager } from './worker.js';

class MediasoupRouterManager {
  static routers: Array<types.Router> = [];

  async create() {
    const worker = mediasoupWorkerManager.getWorker();
    const mediaCodecs = JSON.parse(process.env.MEDIASOUP_MEDIA_CODECS || '{}');
    const router = await worker.createRouter({ mediaCodecs });
    MediasoupRouterManager.routers.push(router);
    return {
      id: router.id,
    };
  }

  get(id: string) {
    return MediasoupRouterManager.routers.find((item) => item.id === id);
  }

  async delete(id: string) {
    const router = this.get(id);
    if (router) {
      router.close();
    }
  }
}

export const mediasoupRouterManager = new MediasoupRouterManager();
