/*
  Warnings:

  - You are about to drop the column `data_pagamento` on the `pagamento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pagamento` DROP COLUMN `data_pagamento`,
    ADD COLUMN `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Anotacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consulta_id` INTEGER NOT NULL,
    `texto` VARCHAR(191) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Anotacao` ADD CONSTRAINT `Anotacao_consulta_id_fkey` FOREIGN KEY (`consulta_id`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
