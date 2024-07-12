/*
  Warnings:

  - The `repeatedDays` column on the `Meal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "repeatedDays",
ADD COLUMN     "repeatedDays" TEXT;
