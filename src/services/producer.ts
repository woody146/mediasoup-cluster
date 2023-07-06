import { constants } from '../constants.js';
import { MediaProducer } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { TransportService } from './transport.js';

export class ProducerService extends BaseService {
  async create(data: {
    transportId: string;
    kind: any;
    rtpParameters: any;
  }): Promise<{
    /**
     * Producer id
     */
    id: string;
  }> {
    const transport = await this.createService(TransportService).get({
      transportId: data.transportId,
    });
    if (transport.type === constants.PRODUCER) {
      const result = await fetchApi({
        host: transport.worker.apiHost,
        port: transport.worker.apiPort,
        path: '/transports/:transportId/producer',
        method: 'POST',
        data: {
          transportId: transport.id,
          kind: data.kind,
          rtpParameters: data.rtpParameters,
        },
      });

      const producer = new MediaProducer();
      producer.id = result.id;
      producer.kind = data.kind;
      producer.transportId = transport.id;
      await this.entityManager.getRepository(MediaProducer).save(producer);
      return result;
    }
    throw new ServiceError(400, 'Invalid transport');
  }

  async pause(data: { producerId: string }) {
    const producer = await this.get(data);
    const transport = await this.createService(TransportService).get({
      transportId: producer.transportId,
    });
    await fetchApi({
      host: transport.worker.apiHost,
      port: transport.worker.apiPort,
      path: '/producers/:producerId/pause',
      method: 'POST',
      data: { producerId: data.producerId },
    });
    return {};
  }

  async resume(data: { producerId: string }) {
    const producer = await this.get(data);
    const transport = await this.createService(TransportService).get({
      transportId: producer.transportId,
    });
    await fetchApi({
      host: transport.worker.apiHost,
      port: transport.worker.apiPort,
      path: '/producers/:producerId/resume',
      method: 'POST',
      data: { producerId: data.producerId },
    });
    return {};
  }

  async get(data: { producerId: string }) {
    const producer = await this.entityManager
      .getRepository(MediaProducer)
      .findOne({
        where: { id: data.producerId },
      });
    if (producer) {
      return producer;
    }
    throw new ServiceError(404, 'Producer not found');
  }
}
