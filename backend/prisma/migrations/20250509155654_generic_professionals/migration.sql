/*
  Warnings:

  - You are about to drop the column `paciente_id` on the `diario` table. All the data in the column will be lost.
  - You are about to drop the `consulta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutricionista` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `paciente` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `client_id` to the `Diario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `consulta` DROP FOREIGN KEY `Consulta_nutricionista_id_fkey`;

-- DropForeignKey
ALTER TABLE `consulta` DROP FOREIGN KEY `Consulta_paciente_id_fkey`;

-- DropForeignKey
ALTER TABLE `diario` DROP FOREIGN KEY `Diario_paciente_id_fkey`;

-- DropForeignKey
ALTER TABLE `documento` DROP FOREIGN KEY `Documento_consulta_id_fkey`;

-- DropForeignKey
ALTER TABLE `paciente` DROP FOREIGN KEY `Paciente_nutricionista_id_fkey`;

-- DropForeignKey
ALTER TABLE `pagamento` DROP FOREIGN KEY `Pagamento_consulta_id_fkey`;

-- DropIndex
DROP INDEX `Diario_paciente_id_fkey` ON `diario`;

-- DropIndex
DROP INDEX `Documento_consulta_id_fkey` ON `documento`;

-- DropIndex
DROP INDEX `Pagamento_consulta_id_fkey` ON `pagamento`;

-- AlterTable
ALTER TABLE `diario` DROP COLUMN `paciente_id`,
    ADD COLUMN `client_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `consulta`;

-- DropTable
DROP TABLE `nutricionista`;

-- DropTable
DROP TABLE `paciente`;

-- CreateTable
CREATE TABLE `Professional` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha_hash` VARCHAR(191) NOT NULL,
    `foto_url` VARCHAR(191) NULL,
    `tipo` ENUM('psicologo', 'psiquiatra', 'nutricionista', 'fisioterapeuta', 'fonoaudiologo', 'terapeuta_ocupacional', 'coach', 'medico', 'personal_trainer') NOT NULL,
    `timezone` VARCHAR(191) NULL DEFAULT 'UTC',
    `notificacoes` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Professional_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `professional_id` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NULL,
    `numero` VARCHAR(191) NULL,
    `complemento` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `data_nasc` DATETIME(3) NULL,
    `historico` VARCHAR(191) NULL,
    `alergias` VARCHAR(191) NULL,
    `objetivos` VARCHAR(191) NULL,
    `profissao` VARCHAR(191) NULL,
    `convenio` VARCHAR(191) NULL,
    `numeroCarteirinha` VARCHAR(191) NULL,
    `valorSessao` DOUBLE NULL,
    `status_cadastro` ENUM('ativo', 'inativo', 'bloqueado') NOT NULL DEFAULT 'ativo',
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Client_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NOT NULL,
    `professional_id` INTEGER NOT NULL,
    `data_hora` DATETIME(3) NOT NULL,
    `tipo` ENUM('presencial', 'online') NOT NULL DEFAULT 'presencial',
    `status` ENUM('agendada', 'confirmada', 'cancelada') NOT NULL DEFAULT 'agendada',
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_professional_id_fkey` FOREIGN KEY (`professional_id`) REFERENCES `Professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_professional_id_fkey` FOREIGN KEY (`professional_id`) REFERENCES `Professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diario` ADD CONSTRAINT `Diario_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_consulta_id_fkey` FOREIGN KEY (`consulta_id`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_consulta_id_fkey` FOREIGN KEY (`consulta_id`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
