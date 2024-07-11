-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'banned');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active';
