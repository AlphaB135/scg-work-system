/*
  Warnings:

  - A unique constraint covering the columns `[employeeCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "beginDate" TIMESTAMP(3),
ADD COLUMN     "branch" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "effectiveDate" TIMESTAMP(3),
ADD COLUMN     "employeeCode" TEXT,
ADD COLUMN     "employeeGroup" TEXT,
ADD COLUMN     "employeeType" TEXT,
ADD COLUMN     "individualSetting" JSONB,
ADD COLUMN     "payrollRound" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "salary" DOUBLE PRECISION,
ADD COLUMN     "salaryRound" TEXT,
ADD COLUMN     "sso" BOOLEAN,
ADD COLUMN     "tax" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeCode_key" ON "User"("employeeCode");
