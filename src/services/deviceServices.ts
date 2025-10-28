import { prisma } from "../db/index";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const registerOrLoginDevice = async (deviceImei: string, name: string, outletId: number) => {
  const outlet = await prisma.outlet.findUnique({
    where: { id: outletId }
  });

  if (!outlet) {
    throw new Error("Outlet not found");
  }

  // Cek apakah device sudah ada
  const existingDevice = await prisma.device.findUnique({
    where: { device_imei: deviceImei },
  });

  // Jika sudah ada, update last_seen dan return token
  if (existingDevice) {
    await prisma.device.update({
      where: { id: existingDevice.id },
      data: {
        device_name: name,
        last_seen: new Date(),
        online: true
      }
    });

    const token = jwt.sign(
      { 
        deviceId: existingDevice.id, 
        deviceImei: existingDevice.device_imei,
        outletId: existingDevice.outlet_id
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { 
      status: true,
      message: "Device already registered",
      data: {
        token
      },
    };
  }

  // Jika belum ada, buat device baru
  const newDevice = await prisma.device.create({
    data: {
      device_imei: deviceImei,
      device_name: name,
      outlet_id: outletId,
      last_seen: new Date(),
      online: true
    },
  });

  // Buat token untuk device baru
  const token = jwt.sign(
    { 
      deviceId: newDevice.id, 
      deviceImei: newDevice.device_imei,
      outletId: newDevice.outlet_id  
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { 
    status: true,
    message: "Device registered successfully",
    data: {
      token
    },
  };
};

