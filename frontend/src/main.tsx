import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import "./index.css";
import RegisterPage from "./pages/RegisterPage";
import AuthGuard from "./components/Auth/AuthGuard";
import GuestGuard from "./components/Auth/GuestGuard";
import UserProfile from "./pages/UserProfile";
import UploadPage from "./pages/UploadPage";
import Notification from "./components/Notification/Notification";
import { UploadProvider } from "./hooks/upload/useUploadVideo";
import IndexPage from "./pages/FeedPage";
import Comment from "./components/Comment/Comment";
import FeedPage from "./pages/FeedPage";
import SearchPage from "./pages/SearchPage";
import TagPage from "./pages/TagePage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import Analysis from "./pages/Analysis";
import VideoPage from "./pages/VideoPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

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
                                <FeedPage />
                            }
                        />

                        <Route
                            path="/search"
                            element={
                                <SearchPage />
                            }
                        />

                        <Route
                            path="/tags/:tagName"
                            element={
                                <TagPage />
                            }
                        />

                        <Route
                            path="/upload"
                            element={
                                <AuthGuard>
                                    <UploadPage />
                                </AuthGuard>
                            }
                        />

                        <Route
                            path="/users/:username"
                            element={
                                <UserProfile />
                            }
                        />

                        <Route
                            path="/password/reset"
                            element={
                                <ForgetPasswordPage />
                            }
                        />

                        <Route
                            path="/feed"
                            element={
                                <IndexPage />
                            }
                        />

                        <Route
                            path="/comment"
                            element={
                                <Comment videoOwnerId={22} videoId={1} onClose={() => { }} />
                            }
                        />

                        <Route
                            path="/noti"
                            element={
                                <Notification onClose={() => { }} />
                            }
                        />

                        <Route
                            path="/analysis"
                            element={
                                <Analysis />
                            }
                        />

                        <Route
                            path="/videos/:id"
                            element={
                                <VideoPage />
                            }
                        />

                        <Route
                            path="/reset-password"
                            element={<ResetPasswordPage />}
                        />
                    </Routes>
                </BrowserRouter>
            </UploadProvider>
        </AuthProvider>
    </QueryClientProvider>,
);