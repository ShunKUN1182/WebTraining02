import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./auth.css";

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch("https://fksm.tonkotsu.jp/toukou/signup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert(result.message);
                navigate("/home");
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert("サーバーとの通信に失敗しました");
        }
    };

    return (
        <main className="auth-screen signup-screen">
            <section className="auth-content">
                <h1>新規登録</h1>
                <p className="auth-description">二度と遅刻しちゃだめと心に刻むのよ！！！</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="signup-name">お名前</label>
                    <input
                        id="signup-name"
                        name="name"
                        type="text"
                        placeholder="例：睡井 寝坊助"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label htmlFor="signup-email">メールアドレス</label>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="toukou@ecc.ac.jp"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
