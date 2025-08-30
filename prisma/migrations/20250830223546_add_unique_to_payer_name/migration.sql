/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Payer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payer_name_key" ON "public"."Payer"("name");
