/*
  Warnings:

  - You are about to drop the column `boughtAt` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `transactionMadeAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "boughtAt",
ADD COLUMN     "transactionMadeAt" TIMESTAMP(3) NOT NULL;
