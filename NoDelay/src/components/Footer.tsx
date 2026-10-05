import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import "./footer.css";

const navigationItems = [
    { to: "/home", label: "ホーム", icon: "bx:home" },
    { to: "/history", label: "履歴", icon: "reicon:memo" },
    { to: "/calendar", label: "カレンダー", icon: "akar-icons:calendar" },
    { to: "/statistics", label: "統計", icon: "foundation:graph-bar" },
    { to: "/option", label: "設定", icon: "fa6-solid:gear" },
];

function Footer() {
    return (
        <footer className="bottom-navigation">
            <nav aria-label="メインナビゲーション">
                <ul>
                    {navigationItems.map(({ to, label, icon }) => (
                        <li key={to}>
                            <NavLink to={to} end className={({ isActive }) => isActive ? "active" : undefined}>
                                <Icon icon={icon} height="24" />
                                <span>{label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </footer>
    );
}

export default Footer;
