import { constants } from '../constants.js';
import { MediaConsumer } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { RouterService } from './router.js';
import { TransportService } from './transport.js';

export class ConsumerService extends BaseService {
  async create(data: {
    transportId: string;
    producerId: string;
    rtpCapabilities: any;
  }): Promise<{
    /**
     * Consumer id
     */
    id: string;
  }> {
    const transport = await this.createService(TransportService).get({
      transportId: data.transportId,
    });
    if (transport.type === constants.CONSUMER) {
      await this.createService(RouterService).checkToPipe({
        routerId: transport.routerId,
        producerId: data.producerId,
      });

      const result = await fetchApi({
        host: transport.worker.apiHost,
        port: transport.worker.apiPort,
        path: '/transports/:transportId/consumer',
        method: 'POST',
        data: {
          transportId: transport.id,
          routerId: transport.routerId,
          producerId: data.producerId,
          rtpCapabilities: data.rtpCapabilities,
        },
      });

      const consumer = new MediaConsumer();
      consumer.id = result.id;
      consumer.producerId = data.producerId;
      consumer.transportId = transport.id;
      await this.entityManager.getRepository(MediaConsumer).save(consumer);
      return result;
    }
    throw new ServiceError(400, 'Invalid type transport');
  }

  async resume(data: { consumerId: string }) {
    const consumer = await this.get(data);
    const transport = await this.createService(TransportService).get({
      transportId: consumer.transportId,
    });
    if (transport.type === constants.CONSUMER) {
      await fetchApi({
        host: transport.worker.apiHost,
        port: transport.worker.apiPort,
        path: '/consumers/:consumerId/resume',
        method: 'POST',
        data: { consumerId: data.consumerId },
      });
      return {};
    }
    throw new ServiceError(400, 'Invalid transport');
  }

  async get(data: { consumerId: string }) {
    const consumer = await this.entityManager
      .getRepository(MediaConsumer)
      .findOne({
        where: { id: data.consumerId },
      });
    if (consumer) {
      return consumer;
    }
    throw new ServiceError(404, 'Consumer not found');
  }
}
