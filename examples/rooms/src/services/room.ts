import { Device, type types } from 'mediasoup-client';

export class ClientRoom {
  device = new Device();

  recvTransport?: types.Transport;
  sendTransport?: types.Transport;

  consumers: types.Consumer[] = [];
  producers: types.Producer[] = [];

  onNewProducer: Array<(producer: types.Producer) => void> = [];
  onNewConsumer: Array<(consumer: types.Consumer) => void> = [];

  constructor(public roomId: string) {}

  async initDevice(data: Parameters<Device['load']>[0]) {
    await this.device.load(data);
  }

  initSendTransport(
    data: Parameters<Device['createSendTransport']>[0],
    options: {
      onConnect: (connectParams: { dtlsParameters: any }) => Promise<any>;
      onProduce: (produceParams: {
        kind: types.MediaKind;
        rtpParameters: types.RtpParameters;
      }) => Promise<{ id: string }>;
      onConnecting?: () => void;
      onConnected?: () => void;
      onFailed?: () => void;
    }
  ) {
    const newTransport = this.device.createSendTransport(data);
    newTransport.on('connect', (connectParams, callback, errback) => {
      options.onConnect(connectParams).then(callback).catch(errback);
    });
    newTransport.on('connectionstatechange', async (state) => {
      switch (state) {
        case 'connecting':
          options.onConnecting && options.onConnecting();
          break;

        case 'connected':
          options.onConnected && options.onConnected();
          break;

        case 'failed':
          options.onFailed && options.onFailed();
          break;

        default:
          break;
      }
    });
    newTransport.on('produce', async (produceParams, callback, errback) => {
      try {
        const { id } = await options.onProduce(produceParams);
        callback({ id });
      } catch (err: any) {
        errback(err);
      }
    });
    this.sendTransport = newTransport;
    return newTransport;
  }

  initRecvTransport(
    data: Parameters<Device['createRecvTransport']>[0],
    options: {
      onConnect: (connectParams: { dtlsParameters: any }) => Promise<any>;
      onConnecting?: () => void;
      onConnected?: () => void;
      onFailed?: () => void;
    }
  ) {
    const newTransport = this.device.createRecvTransport(data);
    newTransport.on('connect', (connectParams, callback, errback) => {
      options.onConnect(connectParams).then(callback).catch(errback);
    });
    newTransport.on('connectionstatechange', async (state) => {
      switch (state) {
        case 'connecting':
          options.onConnecting && options.onConnecting();
          break;

        case 'connected':
          options.onConnected && options.onConnected();
          break;

        case 'failed':
          options.onFailed && options.onFailed();
          break;

        default:
          break;
      }
    });
    this.recvTransport = newTransport;
    return newTransport;
  }

  async consume(data: Parameters<types.Transport['consume']>[0]) {
    if (this.recvTransport) {
      const consumer = await this.recvTransport.consume(data);
      this.consumers.push(consumer);
      this.onNewConsumer.forEach((handler) => handler(consumer));
      return consumer;
    }
    throw new Error('Must init recvTransport before');
  }

  async isconsumed(produceId: string) {
    return this.consumers.some((consumer) => consumer.producerId === produceId);
  }

  async produce(data: Parameters<types.Transport['produce']>[0]) {
    if (this.sendTransport) {
      const producer = await this.sendTransport.produce(data);
      this.producers.push(producer);
      this.onNewProducer.forEach((handler) => handler(producer));
      return producer;
    }
    throw new Error('Must init sendTransport before');
  }
}
