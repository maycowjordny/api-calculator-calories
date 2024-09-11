/*
  Warnings:

  - The `DES_DESCRIPTION` column on the `Diet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Diet" DROP COLUMN "DES_DESCRIPTION",
ADD COLUMN     "DES_DESCRIPTION" TEXT[];
