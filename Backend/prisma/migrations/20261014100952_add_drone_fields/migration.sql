/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Drone` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brand` to the `Drone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Drone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flightClass` to the `Drone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Drone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Drone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drone" ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "cameraResolution" TEXT,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "flightClass" TEXT NOT NULL,
ADD COLUMN     "maintenanceRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxFlightTime" INTEGER,
ADD COLUMN     "maxSpeed" INTEGER,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "registrationExpiry" TIMESTAMP(3),
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "serialNumber" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "totalFlightHours" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalFlights" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weight" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Drone_serialNumber_key" ON "Drone"("serialNumber");
