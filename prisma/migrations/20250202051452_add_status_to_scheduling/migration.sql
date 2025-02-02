/*
  Warnings:

  - You are about to drop the column `status` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "schedulings" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "status";
