/*
  Warnings:

  - The `group` column on the `Messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Group" AS ENUM ('SENDING', 'CANCELED', 'CACHE');

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "group",
ADD COLUMN     "group" "Group" DEFAULT 'CACHE';
