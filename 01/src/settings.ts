export const DAILY_CHECK_IN_KEY = "dailyCheckIn";

export const getSchoolStartTime = (date: Date = new Date()) => {
    switch (date.getDay()) {
        case 1:
        case 2:
        case 4:
        case 5:
            return "09:15";
        case 3:
            return "11:00";
        default:
            return null;
    }
};
