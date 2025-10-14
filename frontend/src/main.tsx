import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import "./index.css";

const root: HTMLElement | null = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>,
);
