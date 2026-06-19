-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `role` ENUM('ADMIN', 'EDITOR') NOT NULL DEFAULT 'EDITOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_assets` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(500) NOT NULL,
    `path` VARCHAR(500) NOT NULL,
    `mimeType` VARCHAR(100) NOT NULL,
    `kind` ENUM('IMAGE', 'VIDEO_POSTER') NOT NULL DEFAULT 'IMAGE',
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `sizeBytes` BIGINT NOT NULL,
    `altEn` TEXT NULL,
    `altAr` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `case_studies` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(80) NOT NULL,
    `titleEn` VARCHAR(200) NOT NULL,
    `titleAr` VARCHAR(200) NULL,
    `clientEn` VARCHAR(200) NULL,
    `clientAr` VARCHAR(200) NULL,
    `summaryEn` TEXT NULL,
    `summaryAr` TEXT NULL,
    `challengeEn` TEXT NULL,
    `challengeAr` TEXT NULL,
    `solutionEn` TEXT NULL,
    `solutionAr` TEXT NULL,
    `resultsEn` TEXT NULL,
    `resultsAr` TEXT NULL,
    `category` ENUM('FILM', 'MUSIC_VIDEO', 'DOCUMENTARY', 'TVC', 'ORIGINAL', 'CAMPAIGN', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `metrics` JSON NULL,
    `externalLinks` JSON NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `heroMediaId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `case_studies_slug_key`(`slug`),
    INDEX `case_studies_status_order_idx`(`status`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `case_study_media` (
    `id` VARCHAR(191) NOT NULL,
    `caseStudyId` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `case_study_media_caseStudyId_order_idx`(`caseStudyId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(80) NOT NULL,
    `titleEn` VARCHAR(200) NOT NULL,
    `titleAr` VARCHAR(200) NULL,
    `descriptionEn` TEXT NULL,
    `descriptionAr` TEXT NULL,
    `externalLinks` JSON NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `heroMediaId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `projects_slug_key`(`slug`),
    INDEX `projects_status_order_idx`(`status`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(200) NOT NULL,
    `nameAr` VARCHAR(200) NULL,
    `descriptionEn` TEXT NULL,
    `descriptionAr` TEXT NULL,
    `icon` VARCHAR(100) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `process_steps` (
    `id` VARCHAR(191) NOT NULL,
    `labelEn` VARCHAR(200) NOT NULL,
    `labelAr` VARCHAR(200) NULL,
    `descriptionEn` TEXT NULL,
    `descriptionAr` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_phases` (
    `id` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(200) NOT NULL,
    `nameAr` VARCHAR(200) NULL,
    `bodyEn` TEXT NULL,
    `bodyAr` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment_items` (
    `id` VARCHAR(191) NOT NULL,
    `labelEn` VARCHAR(200) NOT NULL,
    `labelAr` VARCHAR(200) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_members` (
    `id` VARCHAR(191) NOT NULL,
    `nameEn` VARCHAR(200) NOT NULL,
    `nameAr` VARCHAR(200) NULL,
    `roleEn` VARCHAR(200) NULL,
    `roleAr` VARCHAR(200) NULL,
    `bioEn` TEXT NULL,
    `bioAr` TEXT NULL,
    `photoId` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `url` VARCHAR(500) NULL,
    `logoId` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `quoteEn` TEXT NOT NULL,
    `quoteAr` TEXT NULL,
    `authorName` VARCHAR(200) NOT NULL,
    `authorRoleEn` VARCHAR(200) NULL,
    `authorRoleAr` VARCHAR(200) NULL,
    `org` VARCHAR(200) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brand_settings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `siteNameEn` VARCHAR(200) NOT NULL,
    `siteNameAr` VARCHAR(200) NULL,
    `taglineEn` VARCHAR(200) NOT NULL,
    `taglineAr` VARCHAR(200) NULL,
    `secondaryTaglineEn` VARCHAR(300) NULL,
    `secondaryTaglineAr` VARCHAR(300) NULL,
    `logoPrimaryId` VARCHAR(191) NULL,
    `logoAltId` VARCHAR(191) NULL,
    `logoMarkId` VARCHAR(191) NULL,
    `colorPrimary` VARCHAR(191) NOT NULL DEFAULT '#1a202c',
    `colorSecondary` VARCHAR(191) NOT NULL DEFAULT '#0e7490',
    `colorAccent` VARCHAR(191) NOT NULL DEFAULT '#e8722a',
    `colorBg` VARCHAR(191) NOT NULL DEFAULT '#faf8f4',
    `colorText` VARCHAR(191) NOT NULL DEFAULT '#1a202c',
    `fontHeading` VARCHAR(191) NOT NULL DEFAULT 'Inter',
    `fontBody` VARCHAR(191) NOT NULL DEFAULT 'Inter',
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `brand_settings_logoPrimaryId_key`(`logoPrimaryId`),
    UNIQUE INDEX `brand_settings_logoAltId_key`(`logoAltId`),
    UNIQUE INDEX `brand_settings_logoMarkId_key`(`logoMarkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_content` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    `titleEn` VARCHAR(300) NULL,
    `titleAr` VARCHAR(300) NULL,
    `bodyEn` TEXT NULL,
    `bodyAr` TEXT NULL,
    `mediaId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `site_content_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_details` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `email` VARCHAR(200) NULL,
    `phone` VARCHAR(100) NULL,
    `website` VARCHAR(200) NULL,
    `instagram` VARCHAR(200) NULL,
    `tiktok` VARCHAR(200) NULL,
    `addressesEn` JSON NULL,
    `addressesAr` JSON NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `locale` VARCHAR(10) NOT NULL DEFAULT 'en',
    `status` ENUM('NEW', 'READ', 'SPAM') NOT NULL DEFAULT 'NEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contact_submissions_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `case_studies` ADD CONSTRAINT `case_studies_heroMediaId_fkey` FOREIGN KEY (`heroMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `case_studies` ADD CONSTRAINT `case_studies_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `case_study_media` ADD CONSTRAINT `case_study_media_caseStudyId_fkey` FOREIGN KEY (`caseStudyId`) REFERENCES `case_studies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `case_study_media` ADD CONSTRAINT `case_study_media_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_heroMediaId_fkey` FOREIGN KEY (`heroMediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_photoId_fkey` FOREIGN KEY (`photoId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brand_settings` ADD CONSTRAINT `brand_settings_logoPrimaryId_fkey` FOREIGN KEY (`logoPrimaryId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brand_settings` ADD CONSTRAINT `brand_settings_logoAltId_fkey` FOREIGN KEY (`logoAltId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brand_settings` ADD CONSTRAINT `brand_settings_logoMarkId_fkey` FOREIGN KEY (`logoMarkId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `site_content` ADD CONSTRAINT `site_content_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
