import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773394501482 implements MigrationInterface {
    name = 'Migration1773394501482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reposts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "postId" uuid NOT NULL, "message" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_52695faa15b7c703f8660581f81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reposts" ADD CONSTRAINT "FK_d8f973ec285886ab4331780d4c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reposts" ADD CONSTRAINT "FK_547e95c4a7ff1ec4a3715eec071" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reposts" DROP CONSTRAINT "FK_547e95c4a7ff1ec4a3715eec071"`);
        await queryRunner.query(`ALTER TABLE "reposts" DROP CONSTRAINT "FK_d8f973ec285886ab4331780d4c6"`);
        await queryRunner.query(`DROP TABLE "reposts"`);
    }

}
