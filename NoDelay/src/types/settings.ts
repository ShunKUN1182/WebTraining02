export const DAILY_CHECK_IN_KEY = "dailyCheckIn";

export const WEEKLY_SCHEDULE_KEY = "weeklySchedule";

export const WEEKDAYS = [
    { key: "sunday", label: "日", day: 0 },
    { key: "monday", label: "月", day: 1 },
    { key: "tuesday", label: "火", day: 2 },
    { key: "wednesday", label: "水", day: 3 },
    { key: "thursday", label: "木", day: 4 },
    { key: "friday", label: "金", day: 5 },
    { key: "saturday", label: "土", day: 6 },
] as const;

export type Weekday = (typeof WEEKDAYS)[number]["key"];
export type WeeklySchedule = Record<Weekday, string>;

export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
    sunday: "",
    monday: "09:15",
    tuesday: "09:15",
    wednesday: "11:00",
    thursday: "09:15",
    friday: "09:15",
    saturday: "",
};

export const getWeeklySchedule = (): WeeklySchedule => {
    const saved = localStorage.getItem(WEEKLY_SCHEDULE_KEY);
    if (!saved) return { ...DEFAULT_WEEKLY_SCHEDULE };

    try {
        const parsed = JSON.parse(saved) as Partial<WeeklySchedule>;
        return Object.fromEntries(
            WEEKDAYS.map(({ key }) => {
                const time = parsed[key];
                return [
                    key,
                    typeof time === "string" && (time === "" || /^\d{2}:\d{2}$/.test(time))
                        ? time
                        : DEFAULT_WEEKLY_SCHEDULE[key],
                ];
            }),
        ) as WeeklySchedule;
    } catch {
        return { ...DEFAULT_WEEKLY_SCHEDULE };
    }
};

export const saveWeeklySchedule = (schedule: WeeklySchedule) => {
    localStorage.setItem(WEEKLY_SCHEDULE_KEY, JSON.stringify(schedule));
};

export const getSchoolStartTime = (date: Date = new Date()) => {
    const weekday = WEEKDAYS.find(({ day }) => day === date.getDay());
    return weekday ? getWeeklySchedule()[weekday.key] || null : null;
};
