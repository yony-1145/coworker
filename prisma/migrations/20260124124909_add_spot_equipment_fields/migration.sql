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
    "hasQuietSpace" BOOLEAN NOT NULL DEFAULT false,
    "hasLargeTable" BOOLEAN NOT NULL DEFAULT false,
    "hasPhoneCallOK" BOOLEAN NOT NULL DEFAULT false,
    "hasMeetingSpace" BOOLEAN NOT NULL DEFAULT false,
    "crowdLevel" TEXT NOT NULL DEFAULT 'MID',
    "imageUrls" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Spot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Spot" ("address", "createdAt", "crowdLevel", "description", "genre", "hasPower", "hasWifi", "id", "imageUrls", "latE5", "latitude", "lngE5", "longitude", "openingHours", "title", "updatedAt", "userId") SELECT "address", "createdAt", "crowdLevel", "description", "genre", "hasPower", "hasWifi", "id", "imageUrls", "latE5", "latitude", "lngE5", "longitude", "openingHours", "title", "updatedAt", "userId" FROM "Spot";
DROP TABLE "Spot";
ALTER TABLE "new_Spot" RENAME TO "Spot";
CREATE INDEX "Spot_latE5_lngE5_idx" ON "Spot"("latE5", "lngE5");
CREATE INDEX "Spot_hasWifi_hasPower_crowdLevel_idx" ON "Spot"("hasWifi", "hasPower", "crowdLevel");
CREATE INDEX "Spot_genre_idx" ON "Spot"("genre");
CREATE UNIQUE INDEX "Spot_latE5_lngE5_key" ON "Spot"("latE5", "lngE5");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
