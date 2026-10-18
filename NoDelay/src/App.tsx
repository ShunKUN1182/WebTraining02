import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.tsx";
import Home from "./page/Home.tsx";
import History from "./page/History.tsx";
import Calendar from "./page/Calendar.tsx";
import Statistics from "./page/Statistics.tsx";
import Option from "./page/Option.tsx";
import Login from "./page/Login.tsx";
import Signup from "./page/Signup.tsx";

function AppLayout() {
    return (
        <>
            <Outlet />
            <Footer />
        </>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/history" element={<History />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/option" element={<Option />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
        </Routes>
    );
}

export default App;
