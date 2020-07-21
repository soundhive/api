import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketingGang1595321043587 implements MigrationInterface {
  name = 'TicketingGang1595321043587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" uuid NOT NULL, "assignedUserId" uuid, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticket-comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "ticketId" uuid NOT NULL, CONSTRAINT "PK_6445f9406c6f4111344f6b78efc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD CONSTRAINT "FK_8f39aebfe95a905bafb494fd74b" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD CONSTRAINT "FK_f8685099711b1d9d24ebad47ac9" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket-comment" ADD CONSTRAINT "FK_b3d2b4b607f76f01ce4b5f3e1ac" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket-comment" ADD CONSTRAINT "FK_c8060abbf15d88a6a2cecf0bf28" FOREIGN KEY ("ticketId") REFERENCES "ticket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket-comment" DROP CONSTRAINT "FK_c8060abbf15d88a6a2cecf0bf28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket-comment" DROP CONSTRAINT "FK_b3d2b4b607f76f01ce4b5f3e1ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" DROP CONSTRAINT "FK_f8685099711b1d9d24ebad47ac9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" DROP CONSTRAINT "FK_8f39aebfe95a905bafb494fd74b"`,
    );
    await queryRunner.query(`DROP TABLE "ticket-comment"`);
    await queryRunner.query(`DROP TABLE "ticket"`);
  }
}
