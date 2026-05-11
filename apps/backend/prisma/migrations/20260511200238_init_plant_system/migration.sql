-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" TEXT,
    "profilePhoto" TEXT,
    "timezone" TEXT DEFAULT 'UTC',
    "language" TEXT DEFAULT 'pt-BR',
    "country" TEXT,
    "city" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "aiPersonality" TEXT,
    "aiGoal" TEXT,
    "planType" TEXT DEFAULT 'FREE',
    "accountStatus" TEXT DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoutineTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIA',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDENTE',
    "tags" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "routineId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledTime" TEXT,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "userId" TEXT NOT NULL,
    "germinatedAt" TIMESTAMP(3),
    "harvestedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantPhase" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "phaseName" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantLog" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mood" TEXT NOT NULL DEFAULT 'healthy',
    "notes" TEXT,
    "tags" JSONB,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantMedia" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "logId" TEXT,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "fileSize" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantEvent" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Routine_userId_idx" ON "Routine"("userId");

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");

-- CreateIndex
CREATE INDEX "Task_routineId_idx" ON "Task"("routineId");

-- CreateIndex
CREATE INDEX "Task_completed_idx" ON "Task"("completed");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_priority_idx" ON "Task"("priority");

-- CreateIndex
CREATE INDEX "Plant_userId_idx" ON "Plant"("userId");

-- CreateIndex
CREATE INDEX "Plant_createdAt_idx" ON "Plant"("createdAt");

-- CreateIndex
CREATE INDEX "PlantPhase_plantId_idx" ON "PlantPhase"("plantId");

-- CreateIndex
CREATE INDEX "PlantPhase_startedAt_idx" ON "PlantPhase"("startedAt");

-- CreateIndex
CREATE INDEX "PlantLog_plantId_idx" ON "PlantLog"("plantId");

-- CreateIndex
CREATE INDEX "PlantLog_loggedAt_idx" ON "PlantLog"("loggedAt");

-- CreateIndex
CREATE INDEX "PlantMedia_plantId_idx" ON "PlantMedia"("plantId");

-- CreateIndex
CREATE INDEX "PlantMedia_logId_idx" ON "PlantMedia"("logId");

-- CreateIndex
CREATE INDEX "PlantEvent_plantId_idx" ON "PlantEvent"("plantId");

-- CreateIndex
CREATE INDEX "PlantEvent_startsAt_idx" ON "PlantEvent"("startsAt");

-- CreateIndex
CREATE INDEX "PlantEvent_type_idx" ON "PlantEvent"("type");

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantPhase" ADD CONSTRAINT "PlantPhase_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantLog" ADD CONSTRAINT "PlantLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantMedia" ADD CONSTRAINT "PlantMedia_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantMedia" ADD CONSTRAINT "PlantMedia_logId_fkey" FOREIGN KEY ("logId") REFERENCES "PlantLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantEvent" ADD CONSTRAINT "PlantEvent_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
