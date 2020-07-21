import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketTitle1595322674940 implements MigrationInterface {
  name = 'TicketTitle1595322674940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "title" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "title"`);
  }
}
