import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import "./index.css";
import RegisterPage from "./pages/RegisterPage";
import App from "./App";
import AuthGuard from "./components/Auth/AuthGuard";
import GuestGuard from "./components/Auth/GuestGuard";
import UserProfile from "./pages/UserProfile";
import UploadPage from "./pages/UploadPage";
import Notification from "./components/Notification/Notification";
import { UploadProvider } from "./hooks/upload/useUploadVideo";
import IndexPage from "./pages";
import Comment from "./components/Comment/Comment";

const queryClient = new QueryClient();

const root: HTMLElement | null = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
             <UploadProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <GuestGuard>
                                <LoginPage />
                            </GuestGuard>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <GuestGuard>
                                <RegisterPage />
                            </GuestGuard>
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <AuthGuard>
                                <App />
                            </AuthGuard>
                        }
                    />

                    <Route
                        path="/users/:username"
                        element={
                            <UserProfile />
                        }
                    />

                    <Route path="/upload"
                        element={
                               <UploadPage />
                        }
                    />

                    {/* <Route path="/index"
                        element={
                               <IndexPage/>
                        }
                    />

                    <Route path="/comment"
                        element={
                               <Comment videoId={1} onClose={() => {}} />
                        }
                    /> */}

                </Routes>
            </BrowserRouter>
            </UploadProvider>
        </AuthProvider>
    </QueryClientProvider>,
);