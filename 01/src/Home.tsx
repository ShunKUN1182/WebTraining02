import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import { DEFAULT_SCHOOL_START_TIME, SCHOOL_START_TIME_KEY } from "./settings.ts";

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

function Home() {
    const navigate = useNavigate();
    const [nowTime, setNowTime] = useState("00:00");
    const [schoolStartTime] = useState(
        () => localStorage.getItem(SCHOOL_START_TIME_KEY) ?? DEFAULT_SCHOOL_START_TIME,
    );
    const [isCheckInAvailable, setIsCheckInAvailable] = useState(false);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
    });

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            setNowTime(`${hours}:${minutes}`);
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

    return (
        <main className="home-screen">
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
                    <div className={`countdown${isLate ? " is-late" : ""}`} aria-live="polite">
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
                        <button className="checkin-button" type="button">
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
                        <svg
                            className="school-art"
                            viewBox="0 0 360 190"
                            role="img"
                            aria-label="時計のある学校"
                        >
                            <path
                                d="M16 166H344"
                                stroke="#e3eee4"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <path
                                d="M58 157c-10-13-8-27 2-37 8 10 10 24 2 37m-2-10v20"
                                fill="#83bd9c"
                                stroke="#6fae89"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M94 160c-9-12-7-25 2-35 8 10 9 23 2 35m-2-12v18"
                                fill="#8dc7a5"
                                stroke="#6fae89"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M267 157c-10-13-8-27 2-37 8 10 10 24 2 37m-2-10v20"
                                fill="#83bd9c"
                                stroke="#6fae89"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M303 160c-9-12-7-25 2-35 8 10 9 23 2 35m-2-12v18"
                                fill="#8dc7a5"
                                stroke="#6fae89"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M116 75h128v87H116z"
                                fill="#f9fcff"
                                stroke="#92b9df"
                                strokeWidth="3"
                            />
                            <path
                                d="M106 73h148"
                                stroke="#84b5e0"
                                strokeWidth="8"
                                strokeLinecap="round"
                            />
                            <path
                                d="M159 76h42v86h-42z"
                                fill="#fff"
                                stroke="#92b9df"
                                strokeWidth="3"
                            />
                            <path
                                d="M127 101h14v15h-14zm30 0h14v15h-14zm48 0h14v15h-14zM127 128h14v15h-14zm84 0h14v15h-14z"
                                fill="#a8cbea"
                            />
                            <path d="M170 137h21v25h-21z" fill="#8fb9df" />
                            <circle
                                cx="180"
                                cy="49"
                                r="17"
                                fill="#fff"
                                stroke="#92b9df"
                                strokeWidth="3"
                            />
                            <path
                                d="M180 39v11l7 4"
                                fill="none"
                                stroke="#5795d0"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </section>
                </>
            )}
        </main>
    );
}

export default Home;
