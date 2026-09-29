import "./footer.css";
import { Icon } from "@iconify/react";

function Footer() {
    return (
        <>
            <footer>
                <ul>
                    <li>
                        <Icon icon="bx:home" height="24" />
                        <p>ホーム</p>
                    </li>
                    <li>
                        <Icon icon="bx:home" height="24" />
                        <p>履歴</p>
                    </li>
                    <li>
                        <Icon icon="bx:home" height="24" />
                        <p>統計</p>
                    </li>
                    <li>
                        <Icon icon="bx:home" height="24" />
                        <p>カレンダー</p>
                    </li>
                    <li>
                        <Icon icon="bx:home" height="24" />
                        <p>設定</p>
                    </li>
                </ul>
            </footer>
        </>
    );
}

export default Footer;
