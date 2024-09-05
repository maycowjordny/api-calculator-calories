/*
  Warnings:

  - A unique constraint covering the columns `[NUM_QUANTITY]` on the table `Calories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Calories_NUM_QUANTITY_key" ON "Calories"("NUM_QUANTITY");
