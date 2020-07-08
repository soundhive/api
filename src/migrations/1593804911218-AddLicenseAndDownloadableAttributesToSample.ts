/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLicenseAndDownloadableAttributesToSample1593804911218
  implements MigrationInterface {
  name = 'AddLicenseAndDownloadableAttributesToSample1593804911218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "samples" ADD "license" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "samples" ADD "downloadable" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "downloadable"`);
    await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "license"`);
  }
}
