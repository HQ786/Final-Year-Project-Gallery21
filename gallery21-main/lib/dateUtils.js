import { format, toZonedTime } from 'date-fns-tz';

export const formatDateWithTimeZone = (date, timeZone, formatString = 'yyyy-MM-dd hh:mm a') => {
    if (!date || !timeZone) return null;
    const zonedTime = toZonedTime(date, timeZone);
    return format(zonedTime, formatString, { timeZone });
};
