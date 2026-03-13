import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773382687633 implements MigrationInterface {
    name = 'Migration1773382687633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "mediaUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "mediaType" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "mediaType"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "mediaUrl"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "imageUrl" character varying`);
    }

}
