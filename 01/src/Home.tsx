import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import {
    DAILY_CHECK_IN_KEY,
    DEFAULT_SCHOOL_START_TIME,
    SCHOOL_START_TIME_KEY,
} from "./settings.ts";
import SchoolArt from "./SchoolArt.tsx";

const schoolLocation = {
    latitude: 34.706430156513385,
    longitude: 135.5034135997478,
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const earthRadius = 6371000;
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

    return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

type DailyCheckIn = {
    date: string;
    time: string;
    schoolStartTime: string;
};

const getDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatTime = (date: Date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const readTodayCheckIn = (): DailyCheckIn | null => {
    const saved = localStorage.getItem(DAILY_CHECK_IN_KEY);
    if (!saved) return null;

    try {
        const record = JSON.parse(saved) as DailyCheckIn;
        if (record.date === getDateKey(new Date()) && record.time && record.schoolStartTime) {
            return record;
        }
    } catch {
        // Remove malformed records and start today's check-in fresh.
    }

    localStorage.removeItem(DAILY_CHECK_IN_KEY);
    return null;
};

function Home() {
    const navigate = useNavigate();
    const [nowTime, setNowTime] = useState("00:00");
    const [schoolStartTime] = useState(
        () => localStorage.getItem(SCHOOL_START_TIME_KEY) ?? DEFAULT_SCHOOL_START_TIME,
    );
    const [isCheckInAvailable, setIsCheckInAvailable] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(() => readTodayCheckIn() !== null);
    const [checkInRecord, setCheckInRecord] = useState(() => readTodayCheckIn());
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
    });

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setNowTime(formatTime(now));

            const saved = localStorage.getItem(DAILY_CHECK_IN_KEY);
            if (!saved) return;

            try {
                const record = JSON.parse(saved) as DailyCheckIn;
                if (record.date !== getDateKey(now)) {
                    localStorage.removeItem(DAILY_CHECK_IN_KEY);
                    setCheckInRecord(null);
                    setIsCheckedIn(false);
                }
            } catch {
                localStorage.removeItem(DAILY_CHECK_IN_KEY);
                setCheckInRecord(null);
                setIsCheckedIn(false);
            }
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setIsCheckInAvailable(
                    calculateDistance(
                        latitude,
                        longitude,
                        schoolLocation.latitude,
                        schoolLocation.longitude,
                    ) <= 100,
                );
            },
            () => {
                setIsCheckInAvailable(false);
            },
        );
    }, []);
    const distance = calculateDistance(
        location.latitude,
        location.longitude,
        schoolLocation.latitude,
        schoolLocation.longitude,
    );
    const [startHour, startMinute] = schoolStartTime.split(":").map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const minutesUntilStart = startTimeInMinutes - currentTimeInMinutes;
    const isLate = minutesUntilStart < 0;
    const checkedInMinutes = checkInRecord
        ? Number(checkInRecord.time.slice(0, 2)) * 60 + Number(checkInRecord.time.slice(3, 5))
        : 0;
    const checkedInStartMinutes = checkInRecord
        ? Number(checkInRecord.schoolStartTime.slice(0, 2)) * 60 +
          Number(checkInRecord.schoolStartTime.slice(3, 5))
        : startTimeInMinutes;
    const isLateCheckIn = checkedInMinutes > checkedInStartMinutes;
    const resultMinutes = Math.abs(checkedInMinutes - checkedInStartMinutes);

    const handleCheckIn = () => {
        const now = new Date();
        const record: DailyCheckIn = {
            date: getDateKey(now),
            time: formatTime(now),
            schoolStartTime,
        };
        localStorage.setItem(DAILY_CHECK_IN_KEY, JSON.stringify(record));
        setCheckInRecord(record);
        setIsCheckedIn(true);
    };

    return (
        <main
            className={`home-screen${isCheckedIn ? " is-result-screen" : ""}${isCheckedIn && isLateCheckIn ? " is-late-result" : ""}`}
        >
            {isCheckedIn && checkInRecord ? (
                <section className={`checkin-result ${isLateCheckIn ? "is-late" : "is-safe"}`}>
                    <div className="result-icon">
                        <Icon icon={isLateCheckIn ? "lucide:clock-3" : "lucide:check"} />
                    </div>
                    <h1>{isLateCheckIn ? "遅刻" : "セーフ！"}</h1>
                    <p className="result-lead">
                        {isLateCheckIn
                            ? `${resultMinutes}分遅刻しました`
                            : "今日も間に合いました！"}
                    </p>
                    <div className="result-details">
                        <div className="result-time-row">
                            <span>
                                <Icon icon="lucide:clock-3" /> 登校時刻
                            </span>
                            <strong>{checkInRecord.time}</strong>
                        </div>
                        <div className="result-time-row">
                            <span>
                                <Icon icon="lucide:clock-3" /> 登校時間
                            </span>
                            <strong>{checkInRecord.schoolStartTime}</strong>
                        </div>
                        <div className="result-summary">
                            {isLateCheckIn ? (
                                <>
                                    <strong>{resultMinutes}分</strong> 遅刻
                                </>
                            ) : (
                                <>
                                    <strong>{resultMinutes}分</strong> 余裕がありました！
                                </>
                            )}
                        </div>
                    </div>
                    <p className="result-encouragement">
                        {isLateCheckIn
                            ? "次は間に合うように頑張ろう..."
                            : "この調子で明日も頑張ろう！"}
                    </p>
                    <SchoolArt />
                </section>
            ) : (
                <>
                    <header className="home-header">
                        <div>
                            <h1>おはよう！</h1>
                            <p>今日もいい一日になりますように。</p>
                        </div>
                        <button
                            className="settings-button"
                            type="button"
                            aria-label="設定"
                            onClick={() => navigate("/option")}
                        >
                            <Icon icon="lucide:settings" />
                        </button>
                    </header>

                    <section className="clock-section" aria-label="現在時刻と始業時間">
                        <p className="current-time">{nowTime}</p>
                        <div className={`schedule-row${isLate ? " is-late" : ""}`}>
                            <div className="schedule-time">
                                <Icon icon="lucide:clock-3" />
                                <span>登校時間</span>
                                <strong>{schoolStartTime}</strong>
                            </div>
                            <div
                                className={`countdown${isLate ? " is-late" : ""}`}
                                aria-live="polite"
                            >
                                {isLate ? (
                                    <>
                                        <strong>遅刻中！</strong>
                                        <span>{Math.abs(minutesUntilStart)}分遅れ</span>
                                    </>
                                ) : (
                                    <>
                                        <span>あと</span>
                                        <strong>{minutesUntilStart}</strong>
                                        <span>分</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {isCheckInAvailable ? (
                        <>
                            <section className="arrival-card" aria-label="チェックイン可能">
                                <div className="arrival-message">
                                    <Icon icon="lucide:map-pin" />
                                    <div>
                                        <strong>学校に到着しました！</strong>
                                        <p>チェックインできます</p>
                                    </div>
                                </div>
                                <button
                                    className="checkin-button"
                                    type="button"
                                    onClick={handleCheckIn}
                                >
                                    <Icon icon="lucide:map-pin" />
                                    登校チェックイン
                                </button>
                            </section>
                            <div className="location-status" role="status">
                                <span className="location-status-icon">
                                    <Icon icon="lucide:locate-fixed" />
                                </span>
                                <span>位置情報を確認しました</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <button className="location-card" type="button">
                                <Icon className="location-pin" icon="lucide:map-pin" />
                                <span className="location-details">
                                    <strong>
                                        学校まで <b>{distance}m</b>
                                    </strong>
                                    <span>学校に到着するとチェックインできます。</span>
                                </span>
                                <Icon className="location-chevron" icon="lucide:chevron-right" />
                            </button>
                            <section className="morning-illustration" aria-label="登校前の案内">
                                <h2>急いで準備しよう！</h2>
                                <SchoolArt />
                            </section>
                        </>
                    )}
                </>
            )}
        </main>
    );
}

export default Home;
