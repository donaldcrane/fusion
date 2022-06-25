/*
  Warnings:

  - The primary key for the `beneficiary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `credit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `debit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `beneficiary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `credit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `debit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `beneficiary` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `credit` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(50) NOT NULL,
    MODIFY `reference` VARCHAR(255) NULL,
    MODIFY `status` ENUM('pending', 'failed', 'completed', 'refunded', 'settled', 'success', 'cancelled', 'conflict') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `debit` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `balance` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `beneficiary_id_key` ON `beneficiary`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `credit_id_key` ON `credit`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `debit_id_key` ON `debit`(`id`);
