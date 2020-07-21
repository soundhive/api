import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketCommentMessage1595325907420 implements MigrationInterface {
  name = 'TicketCommentMessage1595325907420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket-comment" ADD "message" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket-comment" DROP COLUMN "message"`,
    );
  }
}
