/*
  Warnings:

  - Added the required column `beneficiaryId` to the `beneficiary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `beneficiary` ADD COLUMN `beneficiaryId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `beneficiary` ADD CONSTRAINT `beneficiary_beneficiaryId_fkey` FOREIGN KEY (`beneficiaryId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
