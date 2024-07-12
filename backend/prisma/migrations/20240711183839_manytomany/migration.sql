/*
  Warnings:

  - The `repeatedDays` column on the `Meal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `MealItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MealItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MealItems" DROP CONSTRAINT "_MealItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_MealItems" DROP CONSTRAINT "_MealItems_B_fkey";

-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "repeatedDays",
ADD COLUMN     "repeatedDays" "MealDays";

-- DropTable
DROP TABLE "MealItems";

-- DropTable
DROP TABLE "_MealItems";

-- CreateTable
CREATE TABLE "MealItem" (
    "mealItemId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealItem_pkey" PRIMARY KEY ("mealItemId")
);

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("mealId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;
