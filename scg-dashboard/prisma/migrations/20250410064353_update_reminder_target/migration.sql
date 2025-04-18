/*
  Warnings:

  - You are about to drop the column `type` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `target` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "type",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "target" TEXT NOT NULL;
