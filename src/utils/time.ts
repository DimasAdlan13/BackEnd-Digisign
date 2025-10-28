import { formatInTimeZone } from "date-fns-tz";

// konversi waktu
export const toWIB = (date: Date): string => {
  return formatInTimeZone(date, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
};


export const parseClientDate = (dateString: string): Date => {
  return new Date(dateString);
};