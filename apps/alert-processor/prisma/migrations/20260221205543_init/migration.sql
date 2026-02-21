-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "regionCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "uaqi" INTEGER NOT NULL,
    "pm25" DOUBLE PRECISION NOT NULL,
    "pm10" DOUBLE PRECISION NOT NULL,
    "indexesPayload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);
