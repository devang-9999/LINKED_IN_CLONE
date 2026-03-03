import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772516490369 implements MigrationInterface {
    name = 'Migration1772516490369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "education" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "schoolName" character varying NOT NULL, "degree" character varying, "fieldOfStudy" character varying, "startDate" date, "endDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_bf3d38701b3030a8ad634d43bd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyName" character varying NOT NULL, "title" character varying NOT NULL, "employmentType" character varying, "location" character varying, "description" text, "startDate" date, "endDate" date, "currentlyWorking" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "skillId" uuid, CONSTRAINT "UQ_060bea7fd45868588324719de3c" UNIQUE ("userId", "skillId"), CONSTRAINT "PK_4d0a72117fbf387752dbc8506af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_b54f616411ef3824f6a5c06ea46" UNIQUE ("email"), CONSTRAINT "REL_373ead146f110f04dad6084815" UNIQUE ("userId"), CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "profilePicture" character varying, "coverPicture" character varying, "headline" character varying, "about" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Messages" ("id" SERIAL NOT NULL, "roomId" character varying NOT NULL, "senderId" character varying NOT NULL, "receiverId" character varying NOT NULL, "message" character varying(500) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_ecc722506c4b974388431745e8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_723e67bde13b73c5404305feb14" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience" ADD CONSTRAINT "FK_cbfb1d1219454c9b45f1b3c4274" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_60177dd93dcdc055e4eaa93bade" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_b19f190afaada3852e0f56566bc" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_b19f190afaada3852e0f56566bc"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_60177dd93dcdc055e4eaa93bade"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP CONSTRAINT "FK_cbfb1d1219454c9b45f1b3c4274"`);
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_723e67bde13b73c5404305feb14"`);
        await queryRunner.query(`DROP TABLE "Messages"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "user_skills"`);
        await queryRunner.query(`DROP TABLE "skills"`);
        await queryRunner.query(`DROP TABLE "experience"`);
        await queryRunner.query(`DROP TABLE "education"`);
    }

}
