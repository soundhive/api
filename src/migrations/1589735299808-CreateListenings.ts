import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListenings1589735299808 implements MigrationInterface {
  name = 'CreateListenings1589735299808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listening" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "listenedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "trackId" uuid, CONSTRAINT "PK_385522e31afc7cd2f023ce24ee9" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ADD CONSTRAINT "FK_e8199836c0e6d37116fd944660b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ADD CONSTRAINT "FK_9f10fa23e5a928454911ae143fc" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listening" DROP CONSTRAINT "FK_9f10fa23e5a928454911ae143fc"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" DROP CONSTRAINT "FK_e8199836c0e6d37116fd944660b"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "listening"`, undefined);
  }
}
