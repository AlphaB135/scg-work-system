-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "notifiedAfternoon" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifiedEvening" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifiedMorning" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "notifyBeforeDays" SET DEFAULT 0;
