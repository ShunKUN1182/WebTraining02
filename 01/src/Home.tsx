import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

function Home() {
    const navigate = useNavigate();
    const [nowTime, setNowTime] = useState("00:00");
    const schoolLocation = {
        latitude: 34.706430156513385,
        longitude: 135.5034135997478,
    };
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
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.log("位置情報が入手できませんでした", error);
            },
        );
    }, []);

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
                <div className="schedule-row">
                    <div className="schedule-time">
                        <Icon icon="lucide:clock-3" />
                        <span>登校時間</span>
                        <strong>09:15</strong>
                    </div>
                    <div className="countdown">
                        <span>あと</span>
                        <strong>25</strong>
                        <span>分</span>
                    </div>
                </div>
            </section>

            <button className="location-card" type="button">
                <Icon className="location-pin" icon="lucide:map-pin" />
                <span className="location-details">
                    <strong>
                        学校まで <b>350m</b>
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
                    <path d="M16 166H344" stroke="#e3eee4" strokeWidth="3" strokeLinecap="round" />
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
                    <path d="M116 75h128v87H116z" fill="#f9fcff" stroke="#92b9df" strokeWidth="3" />
                    <path d="M106 73h148" stroke="#84b5e0" strokeWidth="8" strokeLinecap="round" />
                    <path d="M159 76h42v86h-42z" fill="#fff" stroke="#92b9df" strokeWidth="3" />
                    <path
                        d="M127 101h14v15h-14zm30 0h14v15h-14zm48 0h14v15h-14zM127 128h14v15h-14zm84 0h14v15h-14z"
                        fill="#a8cbea"
                    />
                    <path d="M170 137h21v25h-21z" fill="#8fb9df" />
                    <circle cx="180" cy="49" r="17" fill="#fff" stroke="#92b9df" strokeWidth="3" />
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
        </main>
    );
}

export default Home;
