import { Link } from "react-router-dom";
import "./auth.css";

function Signup() {
    return (
        <main className="auth-screen signup-screen">
            <section className="auth-content">
                <h1>新しくはじめる</h1>
                <p className="auth-description">毎日の登校を記録して、続けた分だけ自信に。</p>

                <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
                    <label htmlFor="signup-name">お名前</label>
                    <input
                        id="signup-name"
                        name="name"
                        type="text"
                        placeholder="例：山田 太郎"
                        autoComplete="name"
                        required
                    />

                    <label htmlFor="signup-email">メールアドレス</label>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="signup-password">パスワード</label>
                    <input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="8文字以上"
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <button className="auth-primary-button" type="submit">
                        アカウントを作成
                    </button>
                </form>

                <p className="auth-switch">
                    すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
                </p>
            </section>

            <p className="auth-footnote">毎日の登校を、安心できる記録に。</p>
        </main>
    );
}

export default Signup;
