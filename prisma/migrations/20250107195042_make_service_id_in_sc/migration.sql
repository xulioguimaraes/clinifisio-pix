/*
  Warnings:

  - Added the required column `id_service` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedulings" ADD COLUMN     "id_service" TEXT NOT NULL;
