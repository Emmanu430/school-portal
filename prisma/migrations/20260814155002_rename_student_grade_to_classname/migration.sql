/*
  Warnings:

  - You are about to drop the column `grade` on the `Student` table. All the data in the column will be lost.
  - Added the required column `className` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- AlterTable
ALTER TABLE "Student" RENAME COLUMN "grade" TO "className";