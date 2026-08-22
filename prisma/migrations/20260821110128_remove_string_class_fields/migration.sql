/*
  Warnings:

  - You are about to drop the column `className` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `assignedClass` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "className";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "assignedClass";
