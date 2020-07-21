import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketMessage1595321775346 implements MigrationInterface {
  name = 'TicketMessage1595321775346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "message" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "message"`);
  }
}
