import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import type { CSSProperties } from "react";
import "../css/statistics.css";

type HistoryItem = {
    id: number;
    date: string;
    time: string;
    schoolStartTime: string;
    status: "safe" | "late";
    lateMinutes: number;
};

type HistoryResponse = {
    success: boolean;
    message?: string;
    data?: HistoryItem[];
};

type WeekdayStat = {
    day: string;
    safe: number;
    late: number;
    absent: number;
};

function Statistics() {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // DBから登校履歴を取得する
    useEffect(() => {
        const fetchHistory = async () => {
            const savedUser = localStorage.getItem("user");

            if (!savedUser) {
                setErrorMessage("ユーザー情報が見つかりません。もう一度ログインしてください。");
                setIsLoading(false);
                return;
            }

            try {
                const user = JSON.parse(savedUser);
                const userId = user.user_id;

                if (!userId) {
                    throw new Error("ユーザーIDが見つかりません。");
                }

                const response = await fetch(
                    `https://fksm.tonkotsu.jp/toukou/history.php?userId=${encodeURIComponent(String(userId))}`,
                );

                const result: HistoryResponse = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message ?? "登校履歴の取得に失敗しました。");
                }

                setHistoryItems(result.data ?? []);
            } catch (error) {
                console.error("統計データ取得エラー:", error);

                setErrorMessage(
                    error instanceof Error ? error.message : "統計データを取得できませんでした。",
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // 登校履歴から統計値を計算する
    const attendanceDays = historyItems.length;

    const safeDays = historyItems.filter((item) => item.status === "safe").length;

    const lateItems = historyItems.filter((item) => item.status === "late");

    const lateDays = lateItems.length;

    const totalLateMinutes = lateItems.reduce((total, item) => total + item.lateMinutes, 0);

    const averageLateMinutes = lateDays > 0 ? Math.round(totalLateMinutes / lateDays) : 0;

    const longestLateMinutes =
        lateDays > 0 ? Math.max(...lateItems.map((item) => item.lateMinutes)) : 0;

    const safeRate = attendanceDays > 0 ? Math.round((safeDays / attendanceDays) * 100) : 0;

    // 曜日ごとの登校状況を集計する
    const weekdayNames = ["日", "月", "火", "水", "木", "金", "土"];

    const weekdayStats: WeekdayStat[] = [
        { day: "月", safe: 0, late: 0, absent: 0 },
        { day: "火", safe: 0, late: 0, absent: 0 },
        { day: "水", safe: 0, late: 0, absent: 0 },
        { day: "木", safe: 0, late: 0, absent: 0 },
        { day: "金", safe: 0, late: 0, absent: 0 },
        { day: "土", safe: 0, late: 0, absent: 0 },
        { day: "日", safe: 0, late: 0, absent: 0 },
    ];

    historyItems.forEach((item) => {
        // YYYY-MM-DDをローカル日付として扱い、曜日を取得する
        const date = new Date(`${item.date}T00:00:00`);
        const weekdayIndex = date.getDay();
        const weekdayName = weekdayNames[weekdayIndex];

        const weekday = weekdayStats.find((stat) => stat.day === weekdayName);

        if (!weekday) return;

        if (item.status === "safe") {
            weekday.safe++;
        } else if (item.status === "late") {
            weekday.late++;
        }
    });

    const maxWeekdayCount = Math.max(
        0,
        ...weekdayStats.map(({ safe, late, absent }) => safe + late + absent),
    );

    return (
        <main className="statistics-page">
            <header className="statistics-header">
                <p>YOUR SCHOOL RECORD</p>
                <h1>統計・成績</h1>
            </header>

            {isLoading ? (
                <p role="status">統計データを読み込み中...</p>
            ) : errorMessage ? (
                <p role="alert">{errorMessage}</p>
            ) : (
                <>
                    {attendanceDays === 0 && <p>まだ登校記録がありません。</p>}

                    <section
                        className="statistics-card safe-rate-card"
                        aria-labelledby="safe-rate-title"
                    >
                        <h2 id="safe-rate-title">セーフ率</h2>

                        <div className="safe-rate-content">
                            <div
                                className="safe-rate-chart"
                                role="img"
                                aria-label={`セーフ率 ${safeRate}%`}
                                style={
                                    {
                                        "--safe-rate": `${safeRate}%`,
                                    } as CSSProperties
                                }
                            >
                                <div className="safe-rate-chart-inner">
                                    <strong>
                                        {safeRate}
                                        <span>%</span>
                                    </strong>
                                    <span>セーフ率</span>
                                </div>
                            </div>

                            <dl className="statistics-counts">
                                <div>
                                    <dt>
                                        <Icon icon="lucide:calendar-check-2" />
                                        登校日数
                                    </dt>
                                    <dd>
                                        {attendanceDays}
                                        <span>日</span>
                                    </dd>
                                </div>

                                <div>
                                    <dt>
                                        <Icon icon="lucide:circle-check" />
                                        セーフ回数
                                    </dt>
                                    <dd>
                                        {safeDays}
                                        <span>回</span>
                                    </dd>
                                </div>

                                <div>
                                    <dt>
                                        <Icon icon="lucide:clock-3" />
                                        遅刻回数
                                    </dt>
                                    <dd>
                                        {lateDays}
                                        <span>回</span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </section>

                    <section className="late-summary" aria-label="遅刻時間">
                        <article className="statistics-card late-stat-card">
                            <span>累計遅刻時間</span>
                            <strong>
                                {totalLateMinutes}
                                <small>分</small>
                            </strong>
                        </article>

                        <article className="statistics-card late-stat-card">
                            <span>平均遅刻時間</span>
                            <strong>
                                {averageLateMinutes}
                                <small>分</small>
                            </strong>
                        </article>

                        <article className="statistics-card late-stat-card">
                            <span>最長遅刻時間</span>
                            <strong>
                                {longestLateMinutes}
                                <small>分</small>
                            </strong>
                        </article>
                    </section>

                    <section
                        className="statistics-card weekday-card"
                        aria-labelledby="weekday-title"
                    >
                        <div className="statistics-section-heading">
                            <div>
                                <p>WEEKLY OVERVIEW</p>
                                <h2 id="weekday-title">曜日ごとの登校状況</h2>
                            </div>

                            <span className="chart-legend">
                                <i />
                                セーフ
                                <i className="late-legend" />
                                遅刻
                            </span>
                        </div>

                        <div
                            className="weekday-chart"
                            role="img"
                            aria-label="曜日ごとのセーフと遅刻の回数"
                        >
                            {weekdayStats.map(({ day, safe, late, absent }) => {
                                const count = safe + late + absent;

                                const barHeight =
                                    maxWeekdayCount > 0
                                        ? Math.max((count / maxWeekdayCount) * 100, 3)
                                        : 3;

                                return (
                                    <div className="weekday-column" key={day}>
                                        <div className="weekday-bars">
                                            <div
                                                className="weekday-bar-stack"
                                                style={{
                                                    height: `${barHeight}%`,
                                                }}
                                            >
                                                {absent > 0 && (
                                                    <span
                                                        className="weekday-bar absent-bar"
                                                        style={{
                                                            flex: absent,
                                                        }}
                                                    />
                                                )}

                                                {late > 0 && (
                                                    <span
                                                        className="weekday-bar late-bar"
                                                        style={{
                                                            flex: late,
                                                        }}
                                                    />
                                                )}

                                                {safe > 0 && (
                                                    <span
                                                        className="weekday-bar safe-bar"
                                                        style={{
                                                            flex: safe,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <span className="weekday-label">{day}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="chart-caption">
                            これまでの登校記録を曜日ごとに表示しています
                        </p>
                    </section>
                </>
            )}
        </main>
    );
}

export default Statistics;
