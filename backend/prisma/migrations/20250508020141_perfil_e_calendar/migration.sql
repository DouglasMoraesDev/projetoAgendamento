-- AlterTable
ALTER TABLE `nutricionista` ADD COLUMN `especialidade` VARCHAR(191) NULL,
    ADD COLUMN `foto_url` VARCHAR(191) NULL,
    ADD COLUMN `notificacoes` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `timezone` VARCHAR(191) NULL DEFAULT 'UTC';
