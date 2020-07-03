/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSamples1593701075796 implements MigrationInterface {
    name = 'AddSamples1593701075796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "samples" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(60) NOT NULL, "description" text NOT NULL, "genre" character varying NOT NULL, "filename" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "private" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, CONSTRAINT "PK_d68b5b3bd25a6851b033fb63444" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "listening" ADD "sampleId" uuid`);
        await queryRunner.query(`ALTER TABLE "listening" DROP CONSTRAINT "FK_9f10fa23e5a928454911ae143fc"`);
        await queryRunner.query(`ALTER TABLE "listening" ALTER COLUMN "trackId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "samples" ADD CONSTRAINT "FK_e39316814f25459f88361775fd5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listening" ADD CONSTRAINT "FK_9f10fa23e5a928454911ae143fc" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listening" ADD CONSTRAINT "FK_5920255aa325202f07bf0fc5f25" FOREIGN KEY ("sampleId") REFERENCES "samples"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listening" DROP CONSTRAINT "FK_5920255aa325202f07bf0fc5f25"`);
        await queryRunner.query(`ALTER TABLE "listening" DROP CONSTRAINT "FK_9f10fa23e5a928454911ae143fc"`);
        await queryRunner.query(`ALTER TABLE "samples" DROP CONSTRAINT "FK_e39316814f25459f88361775fd5"`);
        await queryRunner.query(`ALTER TABLE "listening" ALTER COLUMN "trackId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listening" ADD CONSTRAINT "FK_9f10fa23e5a928454911ae143fc" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listening" DROP COLUMN "sampleId"`);
        await queryRunner.query(`DROP TABLE "samples"`);
    }

}
