-- CreateTable
CREATE TABLE "Balance" (
    "uuid" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userUuid" TEXT NOT NULL,

    PRIMARY KEY ("uuid")
);
