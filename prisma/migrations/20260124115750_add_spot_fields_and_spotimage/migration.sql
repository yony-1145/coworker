/*
  Warnings:

  - Added the required column `latE5` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lngE5` to the `Spot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SpotImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "spotId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SpotImage_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Spot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "latE5" INTEGER NOT NULL,
    "lngE5" INTEGER NOT NULL,
    "address" TEXT,
    "openingHours" TEXT,
    "genre" TEXT NOT NULL DEFAULT 'CAFE',
    "hasWifi" BOOLEAN NOT NULL DEFAULT false,
    "hasPower" BOOLEAN NOT NULL DEFAULT false,
    "crowdLevel" TEXT NOT NULL DEFAULT 'MID',
    "imageUrls" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Spot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Spot" ("address", "createdAt", "description", "id", "imageUrls", "latitude", "longitude", "title", "updatedAt", "userId", "latE5", "lngE5") SELECT "address", "createdAt", "description", "id", "imageUrls", "latitude", "longitude", "title", "updatedAt", "userId", CAST(ROUND("latitude" * 100000) AS INTEGER), CAST(ROUND("longitude" * 100000) AS INTEGER) FROM "Spot";
DROP TABLE "Spot";
ALTER TABLE "new_Spot" RENAME TO "Spot";
CREATE INDEX "Spot_latE5_lngE5_idx" ON "Spot"("latE5", "lngE5");
CREATE INDEX "Spot_hasWifi_hasPower_crowdLevel_idx" ON "Spot"("hasWifi", "hasPower", "crowdLevel");
CREATE INDEX "Spot_genre_idx" ON "Spot"("genre");
CREATE UNIQUE INDEX "Spot_latE5_lngE5_key" ON "Spot"("latE5", "lngE5");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "SpotImage_spotId_idx" ON "SpotImage"("spotId");
