import { MigrationInterface, QueryRunner } from "typeorm";

export class EditTblReviewsUpdate1756118626811 implements MigrationInterface {
    name = 'EditTblReviewsUpdate1756118626811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "PK_231ae565c273ee700b283f15c1d"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "PK_231ae565c273ee700b283f15c1d"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id")`);
    }

}
