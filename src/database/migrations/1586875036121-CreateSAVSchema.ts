import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateSAVSchema1586875036121
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema(`sav2`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropSchema(`sav2`);
  }
}
