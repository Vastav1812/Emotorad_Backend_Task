/*
  Warnings:

  - A unique constraint covering the columns `[email,phoneNumber,linkedId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `linkPrecedence` on the `Contact` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "linkPrecedence",
ADD COLUMN     "linkPrecedence" "LinkPrecedence" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_phoneNumber_linkedId_key" ON "Contact"("email", "phoneNumber", "linkedId");
