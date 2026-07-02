/**
 * Given a Unix timestamp (ms or s), returns the start and end of that calendar day in UTC.
 */
export const getDayRangeFromTimestamp = (
  dateTimestamp: string
): { startOfDay: Date; endOfDay: Date } => {
  const ts = Number(dateTimestamp);
  // Accept both seconds and milliseconds
  const ms = ts > 1e10 ? ts : ts * 1000;
  const date = new Date(ms);

  const startOfDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)
  );
  const endOfDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999)
  );

  return { startOfDay, endOfDay };
};
