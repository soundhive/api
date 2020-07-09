import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkTrackToUsers1589826055782 implements MigrationInterface {
  name = 'LinkTrackToUsers1589826055782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD "userId" uuid`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD CONSTRAINT "FK_0af2d7922740882179689430463" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_0af2d7922740882179689430463"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP COLUMN "userId"`,
      undefined,
    );
  }
}
