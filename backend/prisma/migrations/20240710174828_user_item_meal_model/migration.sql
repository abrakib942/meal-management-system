/*
  Warnings:

  - The values [performer] on the enum `UserRoles` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "ItemCategories" AS ENUM ('Protein', 'Starch', 'Veg', 'none');

-- CreateEnum
CREATE TYPE "MealDays" AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday');

-- CreateEnum
CREATE TYPE "MealStatus" AS ENUM ('Completed', 'Incomplete');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRoles_new" AS ENUM ('admin', 'user');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRoles_new" USING ("role"::text::"UserRoles_new");
ALTER TYPE "UserRoles" RENAME TO "UserRoles_old";
ALTER TYPE "UserRoles_new" RENAME TO "UserRoles";
DROP TYPE "UserRoles_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "Item" (
    "itemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ItemCategories" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Meal" (
    "mealId" TEXT NOT NULL,
    "mealDay" "MealDays" NOT NULL,
    "repeatedDays" "MealDays"[],
    "status" "MealStatus" NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("mealId")
);

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;
