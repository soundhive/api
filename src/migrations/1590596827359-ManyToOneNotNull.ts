/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ManyToOneNotNull1590596827359 implements MigrationInterface {
  name = 'ManyToOneNotNull1590596827359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listening" DROP CONSTRAINT "FK_e8199836c0e6d37116fd944660b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" DROP CONSTRAINT "FK_9f10fa23e5a928454911ae143fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ALTER COLUMN "trackId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_5c52e761792791f57de2fec342d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_0af2d7922740882179689430463"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ALTER COLUMN "albumId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT "FK_8e46da7abb99e39551c42451684"`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ALTER COLUMN "description" SET DEFAULT null`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ADD CONSTRAINT "FK_e8199836c0e6d37116fd944660b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ADD CONSTRAINT "FK_9f10fa23e5a928454911ae143fc" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD CONSTRAINT "FK_5c52e761792791f57de2fec342d" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD CONSTRAINT "FK_0af2d7922740882179689430463" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ADD CONSTRAINT "FK_8e46da7abb99e39551c42451684" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT "FK_8e46da7abb99e39551c42451684"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_0af2d7922740882179689430463"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_5c52e761792791f57de2fec342d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" DROP CONSTRAINT "FK_9f10fa23e5a928454911ae143fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" DROP CONSTRAINT "FK_e8199836c0e6d37116fd944660b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ALTER COLUMN "description" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ADD CONSTRAINT "FK_8e46da7abb99e39551c42451684" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ALTER COLUMN "albumId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD CONSTRAINT "FK_0af2d7922740882179689430463" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD CONSTRAINT "FK_5c52e761792791f57de2fec342d" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ALTER COLUMN "trackId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ADD CONSTRAINT "FK_9f10fa23e5a928454911ae143fc" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listening" ADD CONSTRAINT "FK_e8199836c0e6d37116fd944660b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
