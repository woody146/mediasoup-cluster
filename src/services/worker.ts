import { types } from 'mediasoup';
import { constants } from '../constants.js';
import { MediaWorker } from '../entities/index.js';
import { BaseService, ServiceError } from './base.js';

export class WorkerService extends BaseService {
  getCurrent() {
    return this.dataSource.getRepository(MediaWorker).findOne({
      where: {
        internalHost: process.env.SLAVE_INTERNAL_HOST || 'localhost',
        apiPort: Number(process.env.PORT || 80),
      },
    });
  }

  removeCurrent() {
    return this.dataSource
      .createQueryBuilder(MediaWorker, 'MediaWorker')
      .delete()
      .where('internalHost = :internalHost', {
        internalHost: process.env.SLAVE_INTERNAL_HOST || 'localhost',
      })
      .andWhere('apiPort = :apiPort', {
        apiPort: Number(process.env.PORT || 80),
      })
      .execute();
  }

  async addWorkers(workers: Array<types.Worker>) {
    const models = workers.map((worker) => {
      const dbWorker = new MediaWorker();
      dbWorker.internalHost = process.env.SLAVE_INTERNAL_HOST || 'localhost';
      dbWorker.apiPort = Number(process.env.PORT || 80);
      dbWorker.maxPeer = Number(process.env.SLAVE_MAX_PEER_PER_WORKER);
      dbWorker.for = process.env.SLAVE_FOR || constants.CONSUMER;
      dbWorker.pid = worker.pid;
      return dbWorker;
    });

    await this.dataSource.getRepository(MediaWorker).save(models);
  }

  async get(data: { workerId: string }) {
    const worker = await this.dataSource.getRepository(MediaWorker).findOne({
      where: { id: data.workerId },
    });
    if (worker) {
      return worker;
    }
    throw new ServiceError(404, 'Worker not found');
  }

  async getFor(type: string) {
    const worker = await this.dataSource
      .createQueryBuilder()
      .select('worker')
      .from(MediaWorker, 'worker')
      .where('worker.for = :for', { for: type })
      .andWhere('worker.peerCount < worker.maxPeer')
      .getOne();
    if (worker) {
      return worker;
    }
    throw new ServiceError(404, 'Worker not found');
  }
}
