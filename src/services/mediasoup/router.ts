import { types } from 'mediasoup';
import { mediasoupWorkerManager } from './worker.js';
import { ServiceError } from '../base.js';

class MediasoupRouterManager {
  static routers = new Map<string, types.Router>();

  async create(data: { pid: number }) {
    const worker = mediasoupWorkerManager.get(data.pid);
    const mediaCodecs = JSON.parse(process.env.MEDIASOUP_MEDIA_CODECS || '{}');
    const router = await worker.createRouter({ mediaCodecs });
    MediasoupRouterManager.routers.set(router.id, router);
    return {
      id: router.id,
      rtpCapabilities: router.rtpCapabilities,
    };
  }

  close(data: { routerId: string }) {
    const router = this.get(data.routerId);
    router.close();
    return {};
  }

  getRtpCapabilities(data: { routerId: string }) {
    const router = this.get(data.routerId);
    return { rtpCapabilities: router.rtpCapabilities };
  }

  get(id: string) {
    const router = MediasoupRouterManager.routers.get(id);
    if (router) {
      return router;
    }
    throw new ServiceError(404, 'Router not found');
  }

  async delete(id: string) {
    const router = this.get(id);
    if (router) {
      router.close();
    }
  }
}

export const mediasoupRouterManager = new MediasoupRouterManager();
