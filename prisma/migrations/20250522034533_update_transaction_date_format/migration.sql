-- AlterTable
ALTER TABLE "transation" ALTER COLUMN "transaction_date" DROP DEFAULT,
ALTER COLUMN "transaction_date" SET DATA TYPE DATE;
