/*
  Warnings:

  - You are about to drop the column `itemId` on the `Meal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_itemId_fkey";

-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "itemId";

-- CreateTable
CREATE TABLE "MealItems" (
    "mealId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "MealItems_pkey" PRIMARY KEY ("mealId","itemId")
);

-- CreateTable
CREATE TABLE "_MealItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MealItems_AB_unique" ON "_MealItems"("A", "B");

-- CreateIndex
CREATE INDEX "_MealItems_B_index" ON "_MealItems"("B");

-- AddForeignKey
ALTER TABLE "_MealItems" ADD CONSTRAINT "_MealItems_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealItems" ADD CONSTRAINT "_MealItems_B_fkey" FOREIGN KEY ("B") REFERENCES "Meal"("mealId") ON DELETE CASCADE ON UPDATE CASCADE;
