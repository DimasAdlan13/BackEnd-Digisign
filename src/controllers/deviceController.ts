import { Request, Response } from "express";
import { registerOrLoginDevice } from "../services/deviceServices";

export const registerDevice = async (req: Request, res: Response) => {
  try {
    const { deviceImei, name, outletId } = req.body;

    if (!deviceImei || !name || !outletId) {
      return res.status(400).json({ 
        status: false,
        message: "deviceImei, name, and outletId are required" 
      });
    }

    const result = await registerOrLoginDevice(deviceImei, name, outletId);

    res.status(200).json(result);

  } catch (error) {
    console.error("Error in registerDevice:", error);
    
    
    if (error instanceof Error) {
      if (error.message === "Outlet not found") {
        return res.status(404).json({ 
          status: false,
          message: "Outlet not found" 
        });
      }
      if (error.message.includes("duplicate key")) {
        return res.status(409).json({ 
          status: false,
          message: "Device already exists" 
        });
      }
    }
    
    res.status(500).json({ 
      status: false,
      message: "Internal Server Error" 
    });
  }
};

