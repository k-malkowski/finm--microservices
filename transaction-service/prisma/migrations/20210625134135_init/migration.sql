/*
  Warnings:

  - You are about to drop the column `forDate` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `boughtAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "forDate",
ADD COLUMN     "boughtAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userUuid" TEXT NOT NULL;
