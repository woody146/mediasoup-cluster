import { types } from 'mediasoup';
import { constants } from '../constants.js';
import { MediaWorker } from '../entities/index.js';
import { BaseService, ServiceError } from './base.js';

export class WorkerService extends BaseService {
  removeCurrent() {
    return this.entityManager
      .createQueryBuilder(MediaWorker, 'MediaWorker')
      .delete()
      .where('apiHost = :apiHost', {
        apiHost: process.env.LISTEN_HOST || '127.0.0.1',
      })
      .andWhere('apiPort = :apiPort', {
        apiPort: Number(process.env.PORT || 3000),
      })
      .execute();
  }

  async addWorkers(workers: Array<types.Worker>) {
    const models = workers.map((worker) => {
      const dbWorker = new MediaWorker();
      dbWorker.apiHost = process.env.LISTEN_HOST || '127.0.0.1';
      dbWorker.apiPort = Number(process.env.PORT || 3000);
      dbWorker.maxTransport =
        Number(process.env.SLAVE_MAX_TRANSPORT_PER_WORKER) || 100;
      dbWorker.for = process.env.SLAVE_FOR || constants.CONSUMER;
      dbWorker.pid = worker.pid;
      return dbWorker;
    });

    await this.entityManager.getRepository(MediaWorker).save(models);
  }

  async get(data: { workerId: string }) {
    const worker = await this.entityManager.getRepository(MediaWorker).findOne({
      where: { id: data.workerId },
    });
    if (worker) {
      return worker;
    }
    throw new ServiceError(404, 'Worker not found');
  }

  async getFor(type: string) {
    const worker = await this.entityManager
      .createQueryBuilder()
      .select('worker')
      .from(MediaWorker, 'worker')
      .where('worker.for = :for', { for: type })
      .andWhere('worker.transportCount < worker.maxTransport')
      .getOne();
    if (worker) {
      return worker;
    }
    throw new ServiceError(404, 'Worker not found');
  }

  async updateError(host: string, port: string | number) {
    const result = await this.entityManager
      .createQueryBuilder()
      .update(MediaWorker)
      .set({
        errorCount: () => 'errorCount + 1',
      })
      .where('apiHost = :host', { host })
      .andWhere('apiPort = :port', { port })
      .returning('*')
      .execute();
    if (result.raw[0]) {
      const item = result.raw[0];
      if (item.errorCount > 5) {
        // auto remove if many errors
        await this.entityManager
          .createQueryBuilder(MediaWorker, 'MediaWorker')
          .delete()
          .where('apiHost = :host', { host })
          .andWhere('apiPort = :port', { port })
          .execute();
      }
    }
  }
}
