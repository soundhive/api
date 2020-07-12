import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTrackDuration1594558880586 implements MigrationInterface {
  name = 'AddTrackDuration1594558880586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tracks" ADD "duration" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tracks" DROP COLUMN "duration"`);
  }
}
