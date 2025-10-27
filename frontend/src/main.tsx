import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import "./index.css";
import RegisterPage from "./pages/RegisterPage";
import App from "./App";
import AuthGuard from "./components/auth/AuthGuard";
import RoleBasedGuard from "./components/auth/RoleBasedGuard";
import AdminPage from "./pages/AdminPage";
import GuestGuard from "./components/auth/GuestGuard";

const queryClient = new QueryClient();

const root: HTMLElement | null = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          } />

          <Route path="/register" element={
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          } />

          <Route
            path="/admin"
            element={
              <RoleBasedGuard accessibleRoles={["SUPER_ADMIN", "ADMIN"]}>
                <AdminPage />
              </RoleBasedGuard>
            }
          />

          <Route path="/" element={<App />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>,
);
