/*
  Warnings:

  - You are about to drop the column `paymentInfoId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `PaymentInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentStatus` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaymentInfo" DROP CONSTRAINT "PaymentInfo_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentInfoId",
ADD COLUMN     "paymentStatus" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT;

-- DropTable
DROP TABLE "PaymentInfo";
