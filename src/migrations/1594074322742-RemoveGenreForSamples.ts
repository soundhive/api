/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveGenreForSamples1594074322742 implements MigrationInterface {
  name = 'RemoveGenreForSamples1594074322742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "genre"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "samples" ADD "genre" character varying NOT NULL`,
    );
  }
}
