/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSupportsToFollows1594208739528
  implements MigrationInterface {
  name = 'RenameSupportsToFollows1594208739528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supports" DROP CONSTRAINT "FK_f36167454d53c5f5a3669113ce4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supports" DROP CONSTRAINT "FK_d85770921f74f738a5dd621c79a"`,
    );
    await queryRunner.query(`DROP TABLE "supports"`);
    await queryRunner.query(
      `CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "followedAt" TIMESTAMP NOT NULL DEFAULT now(), "toId" uuid, "fromId" uuid, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "FK_fea9045c14322b0dd317d5efbd1" FOREIGN KEY ("toId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "FK_d56d43b433992026a8ed2542ef1" FOREIGN KEY ("fromId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follows" DROP CONSTRAINT "FK_d56d43b433992026a8ed2542ef1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" DROP CONSTRAINT "FK_fea9045c14322b0dd317d5efbd1"`,
    );
    await queryRunner.query(`DROP TABLE "follows"`);
    await queryRunner.query(
      `CREATE TABLE "supports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "supportedAt" TIMESTAMP NOT NULL DEFAULT now(), "toId" uuid, "fromId" uuid, CONSTRAINT "PK_d8c2a7cbebc6494f00dda770105" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "supports" ADD CONSTRAINT "FK_d85770921f74f738a5dd621c79a" FOREIGN KEY ("toId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supports" ADD CONSTRAINT "FK_f36167454d53c5f5a3669113ce4" FOREIGN KEY ("fromId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
