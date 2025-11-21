import {
    format,
    formatDistanceToNowStrict,
    isToday,
    isYesterday,
    isThisWeek,
} from "date-fns";

export function formatChatTime(date: Date) {
    if (isToday(date)) {
        return formatDistanceToNowStrict(date, { addSuffix: true });
    }

    if (isYesterday(date)) {
        return "Yesterday";
    }

    if (isThisWeek(date)) {
        return format(date, "EEE");
    }

    return format(date, "MMM d");
}
