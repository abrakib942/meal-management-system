/*
  Warnings:

  - You are about to drop the `mealOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mealOrder" DROP CONSTRAINT "mealOrder_mealId_fkey";

-- DropForeignKey
ALTER TABLE "mealOrder" DROP CONSTRAINT "mealOrder_userId_fkey";

-- DropTable
DROP TABLE "mealOrder";

-- CreateTable
CREATE TABLE "MealOrder" (
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealOrder_pkey" PRIMARY KEY ("orderId")
);

-- AddForeignKey
ALTER TABLE "MealOrder" ADD CONSTRAINT "MealOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealOrder" ADD CONSTRAINT "MealOrder_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("mealId") ON DELETE RESTRICT ON UPDATE CASCADE;
