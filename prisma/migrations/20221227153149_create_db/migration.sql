-- CreateTable
CREATE TABLE `Contatos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `telefones` VARCHAR(191) NULL,
    `grupos` VARCHAR(191) NULL,
    `aniversario` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `notas` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `modified` DATETIME(3) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grupos` (
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`nome`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `to` VARCHAR(191) NOT NULL,
    `serialized` VARCHAR(191) NULL,
    `body` VARCHAR(191) NULL,
    `from` VARCHAR(191) NULL,
    `group` VARCHAR(191) NULL,
    `notifyName` VARCHAR(191) NULL,
    `self` VARCHAR(191) NULL,
    `caption` VARCHAR(191) NULL,
    `mimetype` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `data` VARCHAR(191) NULL,
    `old` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `hasMedia` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
