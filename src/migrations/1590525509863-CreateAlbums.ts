/* eslint-disable class-methods-use-this */
import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAlbums1590525509863 implements MigrationInterface {
    name = 'CreateAlbums1590525509863'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE "albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(60) NOT NULL, "description" text DEFAULT null, "coverFilename" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
      await queryRunner.query(`ALTER TABLE "tracks" ADD "albumId" uuid`);
      await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_5c52e761792791f57de2fec342d" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
      await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_8e46da7abb99e39551c42451684" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_8e46da7abb99e39551c42451684"`);
      await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_5c52e761792791f57de2fec342d"`);
      await queryRunner.query(`ALTER TABLE "tracks" DROP COLUMN "albumId"`);
      await queryRunner.query(`DROP TABLE "albums"`);
    }

}
