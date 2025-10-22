/*
  Warnings:

  - You are about to drop the `_SpotTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_SpotTags";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_SpotsOnTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SpotsOnTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Spot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SpotsOnTags_B_fkey" FOREIGN KEY ("B") REFERENCES "SpotTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_SpotsOnTags_AB_unique" ON "_SpotsOnTags"("A", "B");

-- CreateIndex
CREATE INDEX "_SpotsOnTags_B_index" ON "_SpotsOnTags"("B");
