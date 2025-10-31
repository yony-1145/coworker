-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "iconUrl" TEXT,
    "headline" TEXT,
    "occupation" TEXT,
    "affiliation" TEXT,
    "location" TEXT,
    "age" INTEGER,
    "links" JSONB,
    "tags" JSONB,
    "bioText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");
