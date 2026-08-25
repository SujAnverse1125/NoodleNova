-- AlterTable: Add verification and relation columns to Transaction
ALTER TABLE "Transaction" ADD COLUMN "userId" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "verificationStatus" TEXT NOT NULL DEFAULT 'unverified';
ALTER TABLE "Transaction" ADD COLUMN "verifiedAt" TIMESTAMP(3);
ALTER TABLE "Transaction" ADD COLUMN "verificationError" TEXT;

-- CreateIndex
CREATE INDEX "Transaction_walletAddress_idx" ON "Transaction"("walletAddress");
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");
CREATE INDEX "Transaction_verificationStatus_idx" ON "Transaction"("verificationStatus");
CREATE INDEX "Feedback_walletAddress_idx" ON "Feedback"("walletAddress");
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");

-- AddForeignKey: nullable userId, ON DELETE SET NULL
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: link transactions to users by exact wallet address match
UPDATE "Transaction" t SET "userId" = u."id" FROM "User" u WHERE t."walletAddress" = u."walletAddress";
