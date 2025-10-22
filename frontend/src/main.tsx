import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage";
import "./index.css";
import RegisterPage from "./pages/RegisterPage";
import { StrictMode } from "react";
import App from "./App";

const queryClient = new QueryClient();

const root: HTMLElement | null = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  // <QueryClientProvider client={queryClient}>
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/login" element={<LoginPage />} />
  //       <Route path="/register" element={<RegisterPage />}></Route>
  //     </Routes>
  //   </BrowserRouter>
  // </QueryClientProvider>,
  <StrictMode>
    <App />
  </StrictMode>,
);
