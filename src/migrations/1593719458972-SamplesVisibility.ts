/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SamplesVisibility1593719458972 implements MigrationInterface {
  name = 'SamplesVisibility1593719458972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "samples" RENAME COLUMN "private" TO "visibility"`,
    );
    await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "visibility"`);
    await queryRunner.query(
      `ALTER TABLE "samples" ADD "visibility" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "visibility"`);
    await queryRunner.query(
      `ALTER TABLE "samples" ADD "visibility" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" RENAME COLUMN "visibility" TO "private"`,
    );
  }
}
