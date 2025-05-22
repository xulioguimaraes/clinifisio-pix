-- CreateTable
CREATE TABLE "transaction_pix" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "pixId" TEXT NOT NULL,
    "transactionId" TEXT,
    "qrCode" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "schedulingId" TEXT,

    CONSTRAINT "transaction_pix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_pix_pixId_key" ON "transaction_pix"("pixId");

-- CreateIndex
CREATE INDEX "transaction_pix_userId_idx" ON "transaction_pix"("userId");

-- CreateIndex
CREATE INDEX "transaction_pix_serviceId_idx" ON "transaction_pix"("serviceId");

-- CreateIndex
CREATE INDEX "transaction_pix_pixId_idx" ON "transaction_pix"("pixId");

-- CreateIndex
CREATE INDEX "transaction_pix_status_idx" ON "transaction_pix"("status");
