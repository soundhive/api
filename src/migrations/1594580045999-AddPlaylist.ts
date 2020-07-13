import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlaylist1594580045999 implements MigrationInterface {
  name = 'AddPlaylist1594580045999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "playlists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(60) NOT NULL, "description" text, "coverFilename" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "playlists_tracks_tracks" ("playlistsId" uuid NOT NULL, "tracksId" uuid NOT NULL, CONSTRAINT "PK_bfe65e2ba87b01f96f4b6ad4f73" PRIMARY KEY ("playlistsId", "tracksId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab6c4a249358de7a4a29e3476f" ON "playlists_tracks_tracks" ("playlistsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_08bf53b8192c4bb76fb8680394" ON "playlists_tracks_tracks" ("tracksId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "playlists" ADD CONSTRAINT "FK_708a919e9aa49019000d9e9b68e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "playlists_tracks_tracks" ADD CONSTRAINT "FK_ab6c4a249358de7a4a29e3476f3" FOREIGN KEY ("playlistsId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "playlists_tracks_tracks" ADD CONSTRAINT "FK_08bf53b8192c4bb76fb8680394d" FOREIGN KEY ("tracksId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "playlists_tracks_tracks" DROP CONSTRAINT "FK_08bf53b8192c4bb76fb8680394d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "playlists_tracks_tracks" DROP CONSTRAINT "FK_ab6c4a249358de7a4a29e3476f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "playlists" DROP CONSTRAINT "FK_708a919e9aa49019000d9e9b68e"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_08bf53b8192c4bb76fb8680394"`);
    await queryRunner.query(`DROP INDEX "IDX_ab6c4a249358de7a4a29e3476f"`);
    await queryRunner.query(`DROP TABLE "playlists_tracks_tracks"`);
    await queryRunner.query(`DROP TABLE "playlists"`);
  }
}
