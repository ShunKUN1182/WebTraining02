import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./auth.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch("https://fksm.tonkotsu.jp/toukou/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const result = await response.json();
            console.log(result);
            if (response.ok && result.success) {
                alert(result.message);
                localStorage.setItem("user", JSON.stringify(result.data));
                navigate("/home");
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("サーバーとの通信に失敗しました");
            console.log(error);
        }
    };
    return (
        <main className="auth-screen">
            <section className="auth-content">
                <h1>おかえりなさい</h1>
                <p className="auth-description">ログインして、今日の登校状況を確認しましょう。</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="login-email">メールアドレス</label>
                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="login-password">パスワード</label>
                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="パスワードを入力"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
