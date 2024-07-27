
import { format, addMinutes } from 'date-fns';
import { DateTimeFormat } from './const';

export const getDateTimeWithFormat = (date: Date = new Date(), dateTimeFormat: DateTimeFormat = DateTimeFormat.CUSTOM) => {
    const formattedDate = format(date, dateTimeFormat);
    return formattedDate;
}

export const addMinutesInTheCurrentDate = (amount: number) => {
    const now = new Date();
    const futureTime = addMinutes(now, amount)
    return futureTime;
}