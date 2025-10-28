import { Request, Response } from "express";
import { checkDeviceSync, getDownloadListByScheduleIds } from "../services/downloadServices";

export const checkSync = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const deviceId = user.deviceId;

    const { owned_schedule_ids = [] } = req.body;

    const result = await checkDeviceSync(deviceId, owned_schedule_ids);
    res.status(200).json(result);
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ success: false, message: "Failed to sync" });
  }
};

export const getDownloadList = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const deviceId = user.deviceId;

    const scheduleIdsParam = req.query.schedule_ids as string;

    if (!scheduleIdsParam) {
      return res.status(400).json({
        success: false,
        message: "schedule_ids query parameter is required"
      });
    }

    const scheduleIds = scheduleIdsParam.split(',').map(id => parseInt(id.trim()));

    if (scheduleIds.some(isNaN)) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule_ids format"
      });
    }

    console.log(`[getDownloadList] Device ${deviceId} requesting: ${scheduleIds}`);

    const result = await getDownloadListByScheduleIds(deviceId, scheduleIds);

    console.log(`[getDownloadList] Found ${result.total} media`);

    res.status(200).json(result);

  } catch (error) {
    console.error("Error in getDownloadList:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get download list"
    });
  }
};