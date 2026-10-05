import { Link } from "react-router-dom";
import "./auth.css";

function Login() {
    return (
        <main className="auth-screen">
            <section className="auth-content">
                <h1>おかえりなさい</h1>
                <p className="auth-description">ログインして、今日の登校状況を確認しましょう。</p>

                <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
                    <label htmlFor="login-email">メールアドレス</label>
                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="login-password">パスワード</label>
                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="パスワードを入力"
                        autoComplete="current-password"
                        required
                    />

                    <button className="auth-primary-button" type="submit">
                        ログイン
                    </button>
                </form>

                <p className="auth-switch">
                    アカウントをお持ちでない方は <Link to="/signup">新規登録</Link>
                </p>
            </section>

            <p className="auth-footnote">毎日の登校を、安心できる記録に。</p>
        </main>
    );
}

export default Login;
