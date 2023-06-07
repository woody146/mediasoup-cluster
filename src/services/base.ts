import { type DataSource } from 'typeorm';

export class BaseService {
  constructor(protected dataSource: DataSource) {}
}
