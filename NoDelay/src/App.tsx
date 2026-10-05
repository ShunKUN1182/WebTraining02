import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.tsx";
import Home from "./Home.tsx";
import History from "./History.tsx";
import Calendar from "./Calendar.tsx";
import Statistics from "./Statistics.tsx";
import Option from "./Option.tsx";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";

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
