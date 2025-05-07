-- CreateTable
CREATE TABLE `Nutricionista` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha_hash` VARCHAR(191) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Nutricionista_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paciente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nutricionista_id` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `data_nasc` DATETIME(3) NULL,
    `historico` VARCHAR(191) NULL,
    `alergias` VARCHAR(191) NULL,
    `objetivos` VARCHAR(191) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Consulta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER NOT NULL,
    `nutricionista_id` INTEGER NOT NULL,
    `data_hora` DATETIME(3) NOT NULL,
    `tipo` ENUM('presencial', 'online') NOT NULL DEFAULT 'presencial',
    `status` ENUM('agendada', 'confirmada', 'cancelada') NOT NULL DEFAULT 'agendada',
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `refeicao` VARCHAR(191) NULL,
    `porcao` VARCHAR(191) NULL,
    `calorias` INTEGER NULL,
    `macros` JSON NULL,
    `nota` VARCHAR(191) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consulta_id` INTEGER NOT NULL,
    `valor` DOUBLE NOT NULL,
    `metodo` ENUM('PIX', 'boleto', 'cartao') NOT NULL DEFAULT 'PIX',
    `status` ENUM('pendente', 'pago', 'falha') NOT NULL DEFAULT 'pendente',
    `data_pagamento` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consulta_id` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NULL,
    `url_arquivo` VARCHAR(191) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Paciente` ADD CONSTRAINT `Paciente_nutricionista_id_fkey` FOREIGN KEY (`nutricionista_id`) REFERENCES `Nutricionista`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consulta` ADD CONSTRAINT `Consulta_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `Paciente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consulta` ADD CONSTRAINT `Consulta_nutricionista_id_fkey` FOREIGN KEY (`nutricionista_id`) REFERENCES `Nutricionista`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diario` ADD CONSTRAINT `Diario_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `Paciente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_consulta_id_fkey` FOREIGN KEY (`consulta_id`) REFERENCES `Consulta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_consulta_id_fkey` FOREIGN KEY (`consulta_id`) REFERENCES `Consulta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
