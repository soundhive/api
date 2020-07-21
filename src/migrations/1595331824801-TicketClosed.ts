import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketClosed1595331824801 implements MigrationInterface {
  name = 'TicketClosed1595331824801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "closed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "closed"`);
  }
}
