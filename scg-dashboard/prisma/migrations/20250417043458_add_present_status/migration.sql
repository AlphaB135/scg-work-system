-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PRESENT';

-- AlterTable
ALTER TABLE "WorkRecord" ADD COLUMN     "clockIn" TIMESTAMP(3),
ADD COLUMN     "clockOut" TIMESTAMP(3);
