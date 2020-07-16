import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDownloadable1594913165719 implements MigrationInterface {
  name = 'RemoveDownloadable1594913165719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "downloadable"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "samples" ADD "downloadable" boolean NOT NULL`,
    );
  }
}
