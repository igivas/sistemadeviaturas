import { QueryRunner } from 'typeorm';

export interface IDefaultRepository<T> {
  create(data: T, queryRunner?: QueryRunner): Promise<T>;
  update(
    oldValue: T,
    newData: Partial<T>,
    queryRunner?: QueryRunner,
  ): Promise<T | undefined>;
}
