import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772626982994 implements MigrationInterface {
    name = 'Migration1772626982994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "password" SET NOT NULL`);
    }

}
