import mediasoup, { type types } from 'mediasoup';

class MediasoupWorkerManager {
  workers = new Array<types.Worker>();
  currentWorker = 0;

  async init() {
    const numWorkers = Number(process.env.MEDIASOUP_NUMBER_OF_WORKERS || '1');

    for (let i = 0; i < numWorkers; ++i) {
      const worker = await mediasoup.createWorker({
        logLevel: (process.env.MEDIASOUP_LOG_LEVEL || 'none') as any,
        logTags: (process.env.MEDIASOUP_LOG_TAGS || ' ').split(' ') as any,
        rtcMinPort: Number(process.env.MEDIASOUP_RTC_MIN_PORT),
        rtcMaxPort: Number(process.env.MEDIASOUP_RTC_MAX_PORT),
      });

      worker.on('died', (e) => {
        console.error(e);
      });

      this.workers.push(worker);
    }
  }

  getWorker() {
    const result = this.workers[this.currentWorker];
    this.currentWorker += 1;
    if (this.currentWorker === this.workers.length) {
      this.currentWorker = 0;
    }
    return result;
  }
}

export const mediasoupWorkerManager = new MediasoupWorkerManager();
