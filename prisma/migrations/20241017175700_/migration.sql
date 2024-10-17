/*
  Warnings:

  - Added the required column `DES_PAYMENT_TYPE` to the `PaymentSession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CARD', 'BOLETO');

-- AlterTable
ALTER TABLE "PaymentSession" ADD COLUMN     "DES_PAYMENT_TYPE" "PaymentType" NOT NULL;
