/*
  Warnings:

  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Balance";

-- CreateTable
CREATE TABLE "Transaction" (
    "uuid" TEXT NOT NULL,
    "forDate" TIMESTAMP(3) NOT NULL,
    "ammount" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "balanceUuid" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    PRIMARY KEY ("uuid")
);
