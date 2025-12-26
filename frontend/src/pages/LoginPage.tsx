import React, { useState } from 'react'
import FormInput from '../components/Auth/FormInput'
import useLogin, { type LoginCredentials } from '../hooks/auth/useLogin'
import backgroundImage from '../assets/background.png'
import { useNavigate, Link, NavLink } from 'react-router'

const GOOGLE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' })
    const [errorMessage, setErrorMessage] = useState<string>('')

    const { mutateAsync: loginMutation, isPending, error } = useLogin()
    const navigate = useNavigate()

    const handleChange = (field: keyof LoginCredentials) => (value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errorMessage) setErrorMessage('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMessage('')

        if (!formData.email || !formData.password) {
            setErrorMessage('Please fill in all fields')
            return
        }
        await loginMutation(formData)
        navigate('/')
    }

    return (
        <main className="flex h-screen">
            <section className="mx-8 md:mx-10 login-form flex-3 flex flex-col w-full max-w-xl">
                <header className="logo flex gap-2 items-center mt-3">
                    <img src={GOOGLE_LOGO} alt="logo" className="h-6" />
                    <p className="text-2xl font-extrabold">Reely</p>
                </header>

                <div className="shrink my-auto lg:px-15">
                    <h1 className="text-4xl font-extrabold">Sign in</h1>
                    <p className="text-gray-400 mt-1 mb-6">Please login to continue your account</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
                            {error instanceof Error ? error.message : 'Login failed. Please try again.'}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex gap-4 flex-col" aria-label="login form">
                        <FormInput label="Email" type="email" value={formData.email} onChange={handleChange('email')} placeholder="Email" />

                        <FormInput label="Password" type="password" value={formData.password} onChange={handleChange('password')} placeholder="Password" />

                        <NavLink to="/password/reset" className='text-right text-sm hover:underline hover:cursor-pointer'>
                            Forgot Password
                        </NavLink>

                        <button
                            type="submit"
                            className="py-3 px-4 bg-black rounded-md text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Sign in"
                            disabled={isPending}
                        >
                            {isPending ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="w-full text-center my-3 text-gray-400">or</p>

                    <button
                        type="button"
                        className="flex gap-2 items-center justify-center py-3 px-4 border border-gray-200 w-full rounded-md font-bold"
                        aria-label="Sign in with Google"
                    >
                        Sign in with Google
                        <img src={GOOGLE_LOGO} alt="google-icon" className="w-5 h-5" />
                    </button>

                    <div className="text-center mt-4">
                        Need an account? <NavLink to="/register" className="underline">Create one</NavLink>
                    </div>
                </div>
            </section>

            <aside className="hidden md:flex md:flex-4 flex-1 min-h-20 bg-blue-500" aria-hidden="true">
                {/* <img src={backgroundImage} alt="" className="w-full h-full object-cover object-left scale-x-[-1]" /> */}
            </aside>
        </main>
    )
}

export default LoginPage