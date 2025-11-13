-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "iconUrl" TEXT,
    "headline" TEXT,
    "occupation" TEXT,
    "affiliation" TEXT,
    "location" TEXT,
    "age" INTEGER,
    "links" JSONB DEFAULT [],
    "tags" JSONB,
    "bioText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserProfile" ("affiliation", "age", "bioText", "createdAt", "displayName", "headline", "iconUrl", "id", "links", "location", "occupation", "tags", "updatedAt", "userId") SELECT "affiliation", "age", "bioText", "createdAt", "displayName", "headline", "iconUrl", "id", "links", "location", "occupation", "tags", "updatedAt", "userId" FROM "UserProfile";
DROP TABLE "UserProfile";
ALTER TABLE "new_UserProfile" RENAME TO "UserProfile";
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
