import "./history.css";

const historyItems = [
    {
        date: "5月24日(木)",
        status: "遅刻",
        scheduled: "9:15",
        arrived: "10:15",
        difference: "60分遅れ",
        tone: "late",
    },
    {
        date: "5月23日(水)",
        status: "セーフ",
        scheduled: "9:15",
        arrived: "9:10",
        difference: "5分前",
        tone: "safe",
    },
    {
        date: "5月22日(火)",
        status: "セーフ",
        scheduled: "9:15",
        arrived: "9:15",
        difference: "時間ぴったり",
        tone: "safe",
    },
    {
        date: "5月21日(月)",
        status: "遅刻",
        scheduled: "9:15",
        arrived: "9:25",
        difference: "10分遅れ",
        tone: "late",
    },
];

function History() {
    return (
        <main className="subpage history-page">
            <header className="history-header">
                <div>
                    <h1>履歴</h1>
                    <p>これまでの登校記録</p>
                </div>
                <span className="history-month">5月</span>
            </header>

            <section className="history-list" aria-label="登校履歴">
                {historyItems.map((item) => (
                    <article className={`history-card is-${item.tone}`} key={item.date}>
                        <div className="history-card-top">
                            <h2>{item.date}</h2>
                            <span className="history-status">
                                <i aria-hidden="true" />
                                {item.status}
                            </span>
                        </div>
                        <div className="history-times">
                            <div>
                                <span>登校時間</span>
                                <strong>{item.scheduled}</strong>
                            </div>
                            <div>
                                <span>登校した時間</span>
                                <strong>{item.arrived}</strong>
                            </div>
                        </div>
                        <div className="history-difference">{item.difference}</div>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default History;
