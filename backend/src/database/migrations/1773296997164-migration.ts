import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773296997164 implements MigrationInterface {
    name = 'Migration1773296997164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('FOLLOW', 'CONNECTION_REQUEST', 'CONNECTION_ACCEPTED')`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'FOLLOW'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "type" character varying NOT NULL`);
    }

}
