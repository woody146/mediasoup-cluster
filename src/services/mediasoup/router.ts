import { types } from 'mediasoup';
import { mediasoupWorkerManager } from './worker.js';
import { ServiceError } from '../base.js';

class MediasoupRouterManager {
  static routers = new Map<string, types.Router>();

  async create(data: { pid: number }) {
    const worker = mediasoupWorkerManager.get(data.pid);
    const mediaCodecs = JSON.parse(
      process.env.MEDIASOUP_MEDIA_CODECS || 'null'
    ) || [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/VP9',
        clockRate: 90000,
        parameters: {
          'profile-id': 2,
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '4d0032',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '42e01f',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000,
        },
      },
    ];
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
