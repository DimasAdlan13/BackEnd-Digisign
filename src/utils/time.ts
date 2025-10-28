import { formatInTimeZone } from "date-fns-tz";

/** 
 * Convert Date (UTC dari database) → String WIB untuk response 
 */
export const toWIB = (date: Date): string => {
  return formatInTimeZone(date, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
};

/** 
 * Parse ISO string dari client → Date object (UTC)
 * Client kirim format: "2025-10-24T10:00:00Z" atau "2025-10-24 10:00:00"
 */
export const parseClientDate = (dateString: string): Date => {
  return new Date(dateString);
};