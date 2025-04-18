/*
  Warnings:

  - You are about to drop the column `checkIn` on the `WorkRecord` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `WorkRecord` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'LATE';

-- AlterTable
ALTER TABLE "WorkRecord" DROP COLUMN "checkIn",
DROP COLUMN "checkOut";
