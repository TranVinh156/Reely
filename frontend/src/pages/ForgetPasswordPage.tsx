import React, { useState } from 'react'
import FormInput from '../components/Auth/FormInput'
import { NavLink } from 'react-router-dom'
import { forgotPassword } from '../api/auth'

const GOOGLE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'

const ForgetPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const [isPending, setIsPending] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');

        if (!email) {
            setErrorMessage('Please enter your email address');
            return;
        }

        setIsPending(true);
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || 'Failed to send reset link.');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <main className="flex h-screen justify-center">
            <section className="mx-8 md:mx-10 login-form flex-3 flex flex-col w-full max-w-xl">
                <div className="shrink my-auto lg:px-15">
                    {!isSubmitted ? (
                        <>
                            <h1 className="text-4xl font-extrabold">Forgot Password</h1>
                            <p className="text-gray-400 mt-1 mb-6">
                                Enter your email address and we'll send you a link to reset your password
                            </p>

                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
                                    {errorMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex gap-4 flex-col" aria-label="forgot password form">
                                <FormInput
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(value) => {
                                        setEmail(value)
                                        if (errorMessage) setErrorMessage('')
                                    }}
                                    placeholder="Enter your email address"
                                />

                                <button
                                    type="submit"
                                    className="py-3 px-4 bg-black rounded-md text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isPending}
                                >
                                    {isPending ? 'Sending...' : 'Send Reset Link'}
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
                            <h1 className="text-4xl font-extrabold">Check Your Email</h1>
                            <p className="text-gray-400 mt-1 mb-6">
                                We've sent a password reset link to <span className="font-semibold text-white">{email}</span>
                            </p>

                            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md" role="alert">
                                If an account exists with this email, you will receive a password reset link shortly.
                            </div>

                            <p className="text-gray-400 text-sm mb-4">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>

                            <button
                                onClick={() => {
                                    setIsSubmitted(false)
                                    setEmail('')
                                }}
                                className="py-3 px-4 w-full bg-gray-200 rounded-md text-black font-bold hover:bg-gray-300"
                            >
                                Try Another Email
                            </button>

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
    )
}

export default ForgetPasswordPage