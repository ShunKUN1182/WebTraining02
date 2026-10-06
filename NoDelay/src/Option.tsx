import { useState } from "react";
import {
    DEFAULT_WEEKLY_SCHEDULE,
    getWeeklySchedule,
    saveWeeklySchedule,
    WEEKDAYS,
    type WeeklySchedule,
} from "./settings.ts";

function Option() {
    const [schedule, setSchedule] = useState(getWeeklySchedule);

    const updateDay = (day: keyof WeeklySchedule, time: string) => {
        const nextSchedule = { ...schedule, [day]: time };
        setSchedule(nextSchedule);
        saveWeeklySchedule(nextSchedule);
    };

    return (
        <main className="subpage">
            <h1>設定</h1>
            <p>学校や通知の設定を変更できます。</p>
            <section className="setting-group" aria-label="曜日ごとの登校時間">
                <h2 className="setting-label">曜日ごとの登校時間</h2>
                <dl className="school-schedule">
                    {WEEKDAYS.slice(1)
                        .concat(WEEKDAYS[0])
                        .map(({ key, label }) => (
                            <div key={key}>
                                <dt>{label}曜日</dt>
                                <dd>
                                    <input
                                        className="setting-time-input"
                                        type="time"
                                        aria-label={`${label}曜日の登校時間`}
                                        value={schedule[key]}
                                        disabled={!schedule[key]}
                                        onChange={(event) => updateDay(key, event.target.value)}
                                    />
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={!schedule[key]}
                                            onChange={(event) =>
                                                updateDay(
                                                    key,
                                                    event.target.checked
                                                        ? ""
                                                        : DEFAULT_WEEKLY_SCHEDULE[key] || "09:15",
                                                )
                                            }
                                        />
                                        休み
                                    </label>
                                </dd>
                            </div>
                        ))}
                </dl>
            </section>
        </main>
    );
}

export default Option;
