/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- First add the column as nullable
ALTER TABLE "users" ADD COLUMN "password" TEXT;

-- Update existing users with a default password (you should change this in production)
UPDATE "users" SET "password" = '$2a$08$YwXxXxXxXxXxXxXxXxXxO.XxXxXxXxXxXxXxXxXxXxXxXxXxXx' WHERE "password" IS NULL;

-- Make the column required
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;
