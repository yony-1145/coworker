-- CreateEnum
CREATE TYPE "CrowdLevel" AS ENUM ('LOW', 'MID', 'HIGH');

-- CreateEnum
CREATE TYPE "SpotGenre" AS ENUM ('CAFE', 'COWORKING', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latE5" INTEGER NOT NULL,
    "lngE5" INTEGER NOT NULL,
    "address" TEXT,
    "openingHours" TEXT,
    "genre" "SpotGenre" NOT NULL DEFAULT 'CAFE',
    "hasWifi" BOOLEAN NOT NULL DEFAULT false,
    "hasPower" BOOLEAN NOT NULL DEFAULT false,
    "hasQuietSpace" BOOLEAN NOT NULL DEFAULT false,
    "hasLargeTable" BOOLEAN NOT NULL DEFAULT false,
    "hasPhoneCallOK" BOOLEAN NOT NULL DEFAULT false,
    "hasMeetingSpace" BOOLEAN NOT NULL DEFAULT false,
    "crowdLevel" "CrowdLevel" NOT NULL DEFAULT 'MID',
    "imageUrls" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotImage" (
    "id" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpotImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SpotTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotComment" (
    "id" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpotComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotRating" (
    "id" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpotRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "iconUrl" TEXT,
    "headline" TEXT,
    "occupation" TEXT,
    "affiliation" TEXT,
    "location" TEXT,
    "age" INTEGER,
    "links" JSONB DEFAULT '[]',
    "tags" JSONB,
    "bioText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SpotsOnTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SpotsOnTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserLocation_userId_key" ON "UserLocation"("userId");

-- CreateIndex
CREATE INDEX "Spot_latE5_lngE5_idx" ON "Spot"("latE5", "lngE5");

-- CreateIndex
CREATE INDEX "Spot_hasWifi_hasPower_crowdLevel_idx" ON "Spot"("hasWifi", "hasPower", "crowdLevel");

-- CreateIndex
CREATE INDEX "Spot_genre_idx" ON "Spot"("genre");

-- CreateIndex
CREATE UNIQUE INDEX "Spot_latE5_lngE5_key" ON "Spot"("latE5", "lngE5");

-- CreateIndex
CREATE INDEX "SpotImage_spotId_idx" ON "SpotImage"("spotId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotTag_name_key" ON "SpotTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "_SpotsOnTags_B_index" ON "_SpotsOnTags"("B");

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotImage" ADD CONSTRAINT "SpotImage_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotComment" ADD CONSTRAINT "SpotComment_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotComment" ADD CONSTRAINT "SpotComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotRating" ADD CONSTRAINT "SpotRating_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotRating" ADD CONSTRAINT "SpotRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpotsOnTags" ADD CONSTRAINT "_SpotsOnTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpotsOnTags" ADD CONSTRAINT "_SpotsOnTags_B_fkey" FOREIGN KEY ("B") REFERENCES "SpotTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
