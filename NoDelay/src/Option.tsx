function Option() {
    return (
        <main className="subpage">
            <h1>設定</h1>
            <p>学校や通知の設定を変更できます。</p>
            <section className="setting-group" aria-label="曜日ごとの登校時間">
                <h2 className="setting-label">曜日ごとの登校時間</h2>
                <dl className="school-schedule">
                    <div>
                        <dt>月・火・木・金</dt>
                        <dd>09:15</dd>
                    </div>
                    <div>
                        <dt>水</dt>
                        <dd>11:00</dd>
                    </div>
                    <div>
                        <dt>土・日</dt>
                        <dd>お休み</dd>
                    </div>
                </dl>
            </section>
        </main>
    );
}

export default Option;
