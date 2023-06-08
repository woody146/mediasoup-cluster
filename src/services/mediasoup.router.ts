import { types } from 'mediasoup';
import { mediasoupWorkerManager } from './mediasoup.worker.js';

export class MediasoupRouterService {
  static routers: Array<types.Router> = [];

  async create() {
    const worker = mediasoupWorkerManager.getWorker();
    const mediaCodecs = JSON.parse(process.env.MEDIASOUP_MEDIA_CODECS || '{}');
    const router = await worker.createRouter({ mediaCodecs });
    MediasoupRouterService.routers.push(router);
    return {
      id: router.id,
    };
  }

  get(id: string) {
    return MediasoupRouterService.routers.find((item) => item.id === id);
  }

  async delete(id: string) {
    const router = this.get(id);
    if (router) {
      router.close();
    }
  }
}
