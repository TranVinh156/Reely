import React, { useState } from 'react'
import FormInput from '../components/FormInput'

interface FormData {
    email: string
    password: string
}

const GOOGLE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' })

    const handleChange = (field: keyof FormData) => (value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submit', formData)
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

                    <form onSubmit={handleSubmit} className="flex gap-4 flex-col" aria-label="login form">
                        <FormInput label="Email" type="email" value={formData.email} onChange={handleChange('email')} placeholder="Email" />

                        <FormInput label="Password" type="password" value={formData.password} onChange={handleChange('password')} placeholder="Password" />

                        <button type="submit" className="py-3 px-4 bg-primary rounded-md text-white font-bold" aria-label="Sign in">
                            Sign in
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
                        Need an account? <a href="#" className="text-blue-600 underline">Create one</a>
                    </div>
                </div>
            </section>

            <aside className="hidden md:flex bg-blue-500 min-h-20 md:flex-4 flex-1" aria-hidden="true" />
        </main>
    )
}

export default LoginPage