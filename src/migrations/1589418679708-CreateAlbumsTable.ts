import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAlbumsTable1589418679708 implements MigrationInterface {
    name = 'CreateAlbumsTable1589418679708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(60) NOT NULL, "description" text NOT NULL, "filename" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "albums_tracks_tracks" ("albumsId" uuid NOT NULL, "tracksId" uuid NOT NULL, CONSTRAINT "PK_6bed075d341c0fe7b53f90d4a13" PRIMARY KEY ("albumsId", "tracksId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_53fc5b9b9d2b03f32c8f81eab8" ON "albums_tracks_tracks" ("albumsId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6165a9f756d20ee61815368018" ON "albums_tracks_tracks" ("tracksId") `, undefined);
        await queryRunner.query(`ALTER TABLE "albums_tracks_tracks" ADD CONSTRAINT "FK_53fc5b9b9d2b03f32c8f81eab8f" FOREIGN KEY ("albumsId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "albums_tracks_tracks" ADD CONSTRAINT "FK_6165a9f756d20ee618153680181" FOREIGN KEY ("tracksId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "albums_tracks_tracks" DROP CONSTRAINT "FK_6165a9f756d20ee618153680181"`, undefined);
        await queryRunner.query(`ALTER TABLE "albums_tracks_tracks" DROP CONSTRAINT "FK_53fc5b9b9d2b03f32c8f81eab8f"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_6165a9f756d20ee61815368018"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_53fc5b9b9d2b03f32c8f81eab8"`, undefined);
        await queryRunner.query(`DROP TABLE "albums_tracks_tracks"`, undefined);
        await queryRunner.query(`DROP TABLE "albums"`, undefined);
    }

}
