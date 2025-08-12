-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "entityId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "public"."Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
