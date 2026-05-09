-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "description" TEXT,
ADD COLUMN     "scheduledDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "scheduledTime" TEXT;
