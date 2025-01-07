-- CreateEnum
CREATE TYPE "LinkPrecedence" AS ENUM ('primary', 'secondary');

-- DropIndex
DROP INDEX "Contact_email_idx";

-- DropIndex
DROP INDEX "Contact_phoneNumber_idx";

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "linkPrecedence" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Contact_email_phoneNumber_idx" ON "Contact"("email", "phoneNumber");
