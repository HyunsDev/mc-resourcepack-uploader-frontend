import { Route, Routes } from "react-router-dom";
import { IndexPage } from "./index";
import { LoginPage } from "./login";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
}
