import { useSearchParams, NavLink } from "react-router-dom";
import React, { useState } from "react";
import { resetPassword } from "../api/auth";
import FormInput from "../components/Auth/FormInput";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");
        if (!newPassword || !confirmPassword) {
            setErrorMessage("Please fill in all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
        if (!token) {
            setErrorMessage("Invalid or missing token.");
            return;
        }
        setIsPending(true);
        try {
            await resetPassword({ token, newPassword });
            setIsSuccess(true);
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || "Failed to reset password.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <main className="flex h-screen justify-center">
            <section className="mx-8 md:mx-10 login-form flex-3 flex flex-col w-full max-w-xl">
                <div className="shrink my-auto lg:px-15">
                    {!isSuccess ? (
                        <>
                            <h1 className="text-4xl font-extrabold">Reset Password</h1>
                            <p className="text-gray-400 mt-1 mb-6">
                                Enter your new password below.
                            </p>
                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="flex gap-4 flex-col" aria-label="reset password form">
                                <FormInput
                                    label="New Password"
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e)}
                                    className="py-3 px-4"
                                />
                                <FormInput
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e)}
                                    className="py-3 px-4"
                                />
                                <button
                                    type="submit"
                                    className="py-3 px-4 bg-black rounded-md text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isPending}
                                >
                                    {isPending ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                            <div className="text-center mt-6">
                                <NavLink to="/login" className="text-sm hover:underline">
                                    Back to Sign In
                                </NavLink>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl font-extrabold">Password Reset Successful</h1>
                            <p className="text-gray-400 mt-1 mb-6">
                                Your password has been reset. You can now sign in with your new password.
                            </p>
                            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md" role="alert">
                                Password reset successful!
                            </div>
                            <div className="text-center mt-6">
                                <NavLink to="/login" className="text-sm hover:underline">
                                    Back to Sign In
                                </NavLink>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default ResetPasswordPage;