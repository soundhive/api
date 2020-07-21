import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAdmin1595313587450 implements MigrationInterface {
    name = 'AddAdmin1595313587450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "samples" DROP COLUMN "downloadable"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
        await queryRunner.query(`ALTER TABLE "samples" ADD "downloadable" boolean NOT NULL`);
    }

}
