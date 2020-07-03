/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLicenseAndDownloadableAttributesToTrack1593626302851
    implements MigrationInterface {
    name = 'AddLicenseAndDownloadableAttributesToTrack1593626302851';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tracks" ADD "license" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tracks" ADD "downloadable" boolean NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tracks" DROP COLUMN "downloadable"`,
        );
        await queryRunner.query(`ALTER TABLE "tracks" DROP COLUMN "license"`);
    }
}
