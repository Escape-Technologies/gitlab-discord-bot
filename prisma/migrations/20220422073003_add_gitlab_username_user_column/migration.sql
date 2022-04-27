/*
  Warnings:

  - A unique constraint covering the columns `[gitlabUsername]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gitlabUsername` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gitlabUsername" VARCHAR NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_gitlabUsername_key" ON "users"("gitlabUsername");
