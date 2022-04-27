-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "discordId" VARCHAR NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trackers" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "gitlabUsername" TEXT NOT NULL,

    CONSTRAINT "trackers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_discordId_key" ON "users"("discordId");

-- AddForeignKey
ALTER TABLE "trackers" ADD CONSTRAINT "trackers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
