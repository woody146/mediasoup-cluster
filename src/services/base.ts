import { type DataSource } from 'typeorm';

export class BaseService {
  constructor(protected dataSource: DataSource) {}

  createService<T extends BaseService>(
    serviceClass: new (dataSource: DataSource) => T
  ) {
    return new serviceClass(this.dataSource);
  }
}
