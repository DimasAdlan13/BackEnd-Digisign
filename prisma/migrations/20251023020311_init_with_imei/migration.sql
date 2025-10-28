-- CreateTable
CREATE TABLE "device" (
    "id" SERIAL NOT NULL,
    "device_number" VARCHAR(30) NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "device_name" VARCHAR(100) NOT NULL,
    "device_orientation" VARCHAR(20) DEFAULT 'landscape',
    "online" BOOLEAN,
    "storage_capacity" BIGINT,
    "last_seen" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_device" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "log_type" VARCHAR(20) NOT NULL,
    "log_message" TEXT NOT NULL,
    "file_size_downloaded" BIGINT DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "media_name" VARCHAR(100) NOT NULL,
    "title" VARCHAR(200),
    "media_type" VARCHAR(10),
    "duration" INTEGER,
    "remote_url" VARCHAR(500) NOT NULL,
    "media_orientation" VARCHAR(20) DEFAULT 'landscape',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "media_active" BOOLEAN DEFAULT true,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outlet" (
    "id" SERIAL NOT NULL,
    "outlet_name" VARCHAR(100) NOT NULL,
    "address" TEXT,

    CONSTRAINT "outlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,
    "start_at" TIMESTAMP(6) NOT NULL,
    "end_at" TIMESTAMP(6) NOT NULL,
    "display_order" INTEGER DEFAULT 1,
    "schedule_active" BOOLEAN DEFAULT true,
    "downloaded_at" TIMESTAMP(6),
    "duration_show" INTEGER,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_device_number_key" ON "device"("device_number");

-- AddForeignKey
ALTER TABLE "device" ADD CONSTRAINT "device_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlet"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "log_device" ADD CONSTRAINT "log_device_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
