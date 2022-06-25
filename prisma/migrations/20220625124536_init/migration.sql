-- CreateTable
CREATE TABLE `beneficiary` (
    `id` VARCHAR(50) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `beneficiaryName` VARCHAR(191) NOT NULL,
    `beneficiaryEmail` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `beneficiaryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `beneficiary_id_key`(`id`),
    INDEX `Beneficiary_owner_fkey`(`owner`),
    INDEX `beneficiary_beneficiaryId_fkey`(`beneficiaryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credit` (
    `id` VARCHAR(50) NOT NULL,
    `amount` INTEGER NOT NULL,
    `type` ENUM('card_payment', 'online_transfer') NOT NULL,
    `reference` VARCHAR(255) NULL,
    `status` ENUM('pending', 'failed', 'completed', 'refunded', 'settled', 'success', 'cancelled', 'conflict') NOT NULL DEFAULT 'pending',
    `user` VARCHAR(191) NOT NULL,
    `sender` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `credit_id_key`(`id`),
    INDEX `Credit_sender_fkey`(`sender`),
    INDEX `Credit_user_fkey`(`user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `debit` (
    `id` VARCHAR(50) NOT NULL,
    `amount` INTEGER NOT NULL,
    `user` VARCHAR(191) NOT NULL,
    `type` ENUM('transfer', 'withdrawal') NOT NULL,
    `receiver` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `debit_id_key`(`id`),
    INDEX `Debit_receiver_fkey`(`receiver`),
    INDEX `Debit_user_fkey`(`user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `balance` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Users_id_key`(`id`),
    UNIQUE INDEX `Users_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `beneficiary` ADD CONSTRAINT `beneficiary_beneficiaryId_fkey` FOREIGN KEY (`beneficiaryId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `beneficiary` ADD CONSTRAINT `Beneficiary_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit` ADD CONSTRAINT `Credit_sender_fkey` FOREIGN KEY (`sender`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit` ADD CONSTRAINT `Credit_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debit` ADD CONSTRAINT `Debit_receiver_fkey` FOREIGN KEY (`receiver`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debit` ADD CONSTRAINT `Debit_user_fkey` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
