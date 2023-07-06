import type { EntityManager } from 'typeorm';

export class BaseService {
  constructor(protected entityManager: EntityManager) {}

  createService<T extends BaseService>(
    serviceClass: new (entityManager: EntityManager) => T
  ) {
    return new serviceClass(this.entityManager);
  }
}

export class ServiceError {
  constructor(public code: number, public message: string) {}
}
