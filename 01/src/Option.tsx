import { useState } from "react";
import { DEFAULT_SCHOOL_START_TIME, SCHOOL_START_TIME_KEY } from "./settings.ts";

function Option() {
    const [schoolStartTime, setSchoolStartTime] = useState(
        () => localStorage.getItem(SCHOOL_START_TIME_KEY) ?? DEFAULT_SCHOOL_START_TIME,
    );

    const updateSchoolStartTime = (value: string) => {
        const nextValue = value || DEFAULT_SCHOOL_START_TIME;
        setSchoolStartTime(nextValue);
        localStorage.setItem(SCHOOL_START_TIME_KEY, nextValue);
    };

    return (
        <main className="subpage">
            <h1>設定</h1>
            <p>学校や通知の設定を変更できます。</p>
            <section className="setting-group">
                <label className="setting-label" htmlFor="school-start-time">登校時間</label>
                <input
                    id="school-start-time"
                    className="setting-time-input"
                    type="time"
                    value={schoolStartTime}
                    onChange={(event) => updateSchoolStartTime(event.target.value)}
                />
                <p className="setting-help">ホーム画面の残り時間と遅刻表示に反映されます。</p>
            </section>
        </main>
    );
}

export default Option;
