import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAlbumIdColumnToTracksTable1589496634924 implements MigrationInterface {
    name = 'AddAlbumIdColumnToTracksTable1589496634924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" ADD "albumId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_5c52e761792791f57de2fec342d" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_5c52e761792791f57de2fec342d"`, undefined);
        await queryRunner.query(`ALTER TABLE "tracks" DROP COLUMN "albumId"`, undefined);
    }

}
