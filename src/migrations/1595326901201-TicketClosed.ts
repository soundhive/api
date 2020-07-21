import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketClosed1595326901201 implements MigrationInterface {
  name = 'TicketClosed1595326901201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "closed" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "closed"`);
  }
}
