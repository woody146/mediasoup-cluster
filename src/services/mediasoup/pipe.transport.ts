import { types } from 'mediasoup';
import { mediasoupRouterManager } from './router.js';
import { fetchApi } from '../../utils/api.js';
import { ServiceError } from '../base.js';

class MediasoupPipeTransportManager {
  static transports = new Map<string, types.PipeTransport>();

  async create(data: { routerId: string }) {
    const router = mediasoupRouterManager.get(data.routerId);
    const transport = await router.createPipeTransport({
      listenIp: process.env.LISTEN_HOST || '127.0.0.1',
      enableSctp: true,
      numSctpStreams: { OS: 1024, MIS: 1024 },
    });
    MediasoupPipeTransportManager.transports.set(transport.id, transport);
    return transport;
  }

  async createDestination(data: {
    routerId: string;
    sourceHost: string;
    sourcePort: string;
    sourceRouterId: string;
    sourceProducerId: string;
  }) {
    const transport = await this.create(data);
    const sourceResult = await fetchApi({
      host: data.sourceHost,
      port: data.sourcePort,
      path: '/routers/:routerId/source_pipe_transports',
      method: 'POST',
      data: {
        routerId: data.sourceRouterId,
        destinationIp: transport.tuple.localIp,
        destinationPort: transport.tuple.localPort,
        destinationSrtpParameters: transport.srtpParameters,
      },
    });
    await transport.connect({
      ip: sourceResult.sourceIp,
      port: sourceResult.sourcePort,
      srtpParameters: sourceResult.sourceSrtpParameters,
    });
    const consumerResult = await fetchApi({
      host: data.sourceHost,
      port: data.sourcePort,
      path: '/pipe_transports/:transportId/consume',
      method: 'POST',
      data: {
        transportId: sourceResult.id,
        producerId: data.sourceProducerId,
      },
    });
    const pipeDataProducer = await transport.produce({
      id: data.sourceProducerId,
      kind: consumerResult.kind,
      rtpParameters: consumerResult.rtpParameters,
      paused: consumerResult.producerPaused,
    });
    return { id: pipeDataProducer.id };
  }

  async createSource(data: {
    routerId: string;
    destinationIp: string;
    destinationPort: number;
    destinationSrtpParameters: types.SrtpParameters;
  }) {
    const transport = await this.create(data);
    await transport.connect({
      ip: data.destinationIp,
      port: data.destinationPort,
      srtpParameters: data.destinationSrtpParameters,
    });
    return {
      id: transport.id,
      sourceIp: transport.tuple.localIp,
      sourcePort: transport.tuple.localPort,
      sourceSrtpParameters: transport.srtpParameters,
    };
  }

  async consume(data: { transportId: string; producerId: string }) {
    const transport = this.get(data);
    const pipeConsumer = await transport.consume({
      producerId: data.producerId,
    });
    return {
      kind: pipeConsumer.kind,
      rtpParameters: pipeConsumer.rtpParameters,
      paused: pipeConsumer.producerPaused,
    };
  }

  get(data: { transportId: string }) {
    const transport = MediasoupPipeTransportManager.transports.get(
      data.transportId
    );
    if (transport) {
      return transport;
    }
    throw new ServiceError(404, 'Transport not found');
  }
}

export const mediasoupPipeTransportManager =
  new MediasoupPipeTransportManager();
