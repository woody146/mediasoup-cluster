import mediasoup, { type types } from 'mediasoup';
import { ServiceError } from '../base.js';

class MediasoupWorkerManager {
  workers = new Array<types.Worker>();

  async init() {
    const numWorkers = Number(process.env.MEDIASOUP_NUMBER_OF_WORKERS || '1');

    for (let i = 0; i < numWorkers; ++i) {
      const worker = await mediasoup.createWorker({
        logLevel: process.env.MEDIASOUP_LOG_LEVEL as any,
        logTags: (process.env.MEDIASOUP_LOG_TAGS || ' ').split(' ') as any,
        rtcMinPort: Number(process.env.MEDIASOUP_RTC_MIN_PORT) || 20000,
        rtcMaxPort: Number(process.env.MEDIASOUP_RTC_MAX_PORT) || 40000,
      });

      worker.on('died', (e) => {
        console.error(e);
      });

      this.workers.push(worker);
    }
  }

  get(pid: number) {
    const worker = this.workers.find((worker) => worker.pid === pid);
    if (worker) {
      return worker;
    }
    throw new ServiceError(404, 'Worker not found');
  }
}

export const mediasoupWorkerManager = new MediasoupWorkerManager();
