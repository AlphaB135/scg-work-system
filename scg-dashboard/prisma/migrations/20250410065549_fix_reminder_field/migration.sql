/*
  Warnings:

  - You are about to drop the column `description` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "description",
ADD COLUMN     "details" TEXT,
ADD COLUMN     "type" "ReminderType" NOT NULL DEFAULT 'CUSTOM',
ALTER COLUMN "target" DROP NOT NULL;
