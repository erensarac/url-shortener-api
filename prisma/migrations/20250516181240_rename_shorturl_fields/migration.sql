/*
  Warnings:

  - You are about to drop the column `accessCount` on the `ShortUrl` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ShortUrl` table. All the data in the column will be lost.
  - You are about to drop the column `shorten_code` on the `ShortUrl` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ShortUrl` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[short_code]` on the table `ShortUrl` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `short_code` to the `ShortUrl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ShortUrl` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ShortUrl_shorten_code_key";

-- AlterTable
ALTER TABLE "ShortUrl" DROP COLUMN "accessCount",
DROP COLUMN "createdAt",
DROP COLUMN "shorten_code",
DROP COLUMN "updatedAt",
ADD COLUMN     "access_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "short_code" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShortUrl_short_code_key" ON "ShortUrl"("short_code");
