import { useEffect, useState } from "react";
import "../css/history.css";

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

function formatDate(dateString: string) {
    const date = new Date(`${dateString}T00:00:00`);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    return `${month}月${day}日(${weekdays[date.getDay()]})`;
}

function getDifference(item: HistoryItem) {
    if (item.lateMinutes > 0) {
        return `${item.lateMinutes}分遅れ`;
    }

    const [arrivalHour, arrivalMinute] = item.time.split(":").map(Number);
    const [startHour, startMinute] = item.schoolStartTime.split(":").map(Number);

    const difference = startHour * 60 + startMinute - (arrivalHour * 60 + arrivalMinute);

    if (difference > 0) {
        return `${difference}分前`;
    }

    return "時間ぴったり";
}

function History() {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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
                    setErrorMessage("ユーザーIDが見つかりません。もう一度ログインしてください。");
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(
                    `https://fksm.tonkotsu.jp/toukou/history.php?userId=${encodeURIComponent(String(userId))}`,
                );

                const result: HistoryResponse = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message ?? "履歴の取得に失敗しました。");
                }

                setHistoryItems(result.data ?? []);
            } catch (error) {
                console.error("履歴取得エラー:", error);
                setErrorMessage(
                    error instanceof Error ? error.message : "履歴を取得できませんでした。",
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const currentMonth = historyItems[0]?.date
        ? `${Number(historyItems[0].date.slice(5, 7))}月`
        : "";

    return (
        <main className="subpage history-page">
            <header className="history-header">
                <div>
                    <h1>履歴</h1>
                    <p>これまでの登校記録</p>
                </div>
                <span className="history-month">{currentMonth}</span>
            </header>

            {isLoading ? (
                <p>履歴を読み込み中...</p>
            ) : errorMessage ? (
                <p role="alert">{errorMessage}</p>
            ) : historyItems.length === 0 ? (
                <p>まだ登校記録がありません。</p>
            ) : (
                <section className="history-list" aria-label="登校履歴">
                    {historyItems.map((item) => {
                        const isLate = item.status === "late";

                        return (
                            <article
                                className={`history-card is-${isLate ? "late" : "safe"}`}
                                key={item.id}
                            >
                                <div className="history-card-top">
                                    <h2>{formatDate(item.date)}</h2>
                                    <span className="history-status">
                                        <i aria-hidden="true" />
                                        {isLate ? "遅刻" : "セーフ"}
                                    </span>
                                </div>

                                <div className="history-times">
                                    <div>
                                        <span>登校予定時間</span>
                                        <strong>{item.schoolStartTime}</strong>
                                    </div>
                                    <div>
                                        <span>登校した時間</span>
                                        <strong>{item.time}</strong>
                                    </div>
                                </div>

                                <div className="history-difference">{getDifference(item)}</div>
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}

export default History;
