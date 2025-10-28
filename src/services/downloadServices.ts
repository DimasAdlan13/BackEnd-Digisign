import { prisma } from "../db";
import { toWIB, parseClientDate } from "../utils/time";


export const checkDeviceSync = async (
  deviceId: number,
  ownedScheduleIds: number[] = [],
) => {
  
  const validOwned = await prisma.schedule.findMany({
    where: { id: { in: ownedScheduleIds }, device_id: deviceId },
    select: { id: true },
  });
  const validOwnedIds = validOwned.map(s => s.id);

// ambil schedule dan media
const activeSchedules = await prisma.schedule.findMany({
  where: { device_id: deviceId, schedule_active: true },
  include: { media: { select: { media_active: true } } }
});


const activeIds = activeSchedules
  .filter(s => s.media?.media_active)
  .map(s => s.id);

  // media nggak aktif
const mediaInactiveIds = activeSchedules
    .filter(s => !s.media?.media_active)
    .map(s => s.id);

const newScheduleIds = activeIds.filter(id => !validOwnedIds.includes(id));

// cari schedule hapus
const deletedScheduleIds = Array.from(new Set([
    ...validOwnedIds.filter(id => !activeIds.includes(id)),
    ...mediaInactiveIds.filter(id => validOwnedIds.includes(id)), 
]));

const updatedScheduleSet = new Set<number>();

const schedUpdated = await prisma.schedule.findMany({
    where: {
      device_id: deviceId,
      id: { in: validOwnedIds },
      update_flag: true,
    },
    select: { id: true },
  });
  schedUpdated.forEach(s => updatedScheduleSet.add(s.id));

const schedMediaUpdated = await prisma.schedule.findMany({
    where: {
      device_id: deviceId,
      id: { in: validOwnedIds },
      media: { update_flag: true },
    },
    select: { id: true },
  });
  schedMediaUpdated.forEach(s => updatedScheduleSet.add(s.id));

const updatedScheduleIds = Array.from(updatedScheduleSet);

  // Tentukan pesan sesuai hasil
  let message = "Sync success";
  if (!(
    newScheduleIds.length > 0 ||
    deletedScheduleIds.length > 0 ||
    updatedScheduleIds.length > 0
  )) {
    message = "No updates";
  } else if (newScheduleIds.length > 0) {
    message = "New schedules available";
  } else if (updatedScheduleIds.length > 0) {
    message = "Schedules or Media updated";
  } else if (deletedScheduleIds.length > 0) {
    message = "Schedules or Media deleted";
  }

  return {
    status: true,
    message,
    data: {
      new_schedule_ids: newScheduleIds,
      updated_schedule_ids: updatedScheduleIds,
      deleted_schedule_ids: deletedScheduleIds,
      total_active_ids: activeIds,
    }
  };
};



export const getDownloadListByScheduleIds = async (
  deviceId: number,
  scheduleIds: number[]
) => {
  const schedules = await prisma.schedule.findMany({
    where: {
      id: { in: scheduleIds },
      device_id: deviceId,
      schedule_active: true,
      start_at: { lte: new Date() },  
      end_at: { gte: new Date() }     // pertimbangan
    },
    include: {
      media: {
        select: {
          id: true,
          media_name: true,
          title: true,
          media_type: true,
          duration: true,
          remote_url: true,
          media_orientation: true,
          updated_at: true 
        }
      }
    }
  });

  const foundScheduleIds = schedules.map(s => s.id);
  const notFoundIds = scheduleIds.filter(id => !foundScheduleIds.includes(id));

  if (notFoundIds.length > 0) {
    console.warn(`[getDownloadList] Not found/expired: ${notFoundIds}`);
  }

  const downloadList = schedules.map(schedule => ({
    media_name: schedule.media.media_name,
    title: schedule.media.title,
    media_type: schedule.media.media_type,
    duration: schedule.media.duration,
    remote_url: schedule.media.remote_url,
    media_orientation: schedule.media.media_orientation,
    media_updated_at: toWIB(schedule.media.updated_at!),  
    start_at: toWIB(schedule.start_at),  
    end_at: toWIB(schedule.end_at),      
    display_order: schedule.display_order,
    duration_show: schedule.duration_show
  }));

  return {
    success: true,
    total: downloadList.length,
    data: downloadList,
    ...(notFoundIds.length > 0 && {
      warning: `${notFoundIds.length} schedule(s) not found or expired`,
      not_found_schedule_ids: notFoundIds
    })
  };
};