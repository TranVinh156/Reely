import { useState } from "react"
import FormInput from "../components/Auth/FormInput"
import useRegister from "../hooks/auth/useRegister"

const GOOGLE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'

interface FormDataType {
    email: string
    username: string
    password: string
    verifyPassword: string
    verifyCode: string
}

interface FormErrors {
    email?: string
    username?: string
    password?: string
    verifyPassword?: string
    verifyCode?: string
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<FormDataType>({
        email: '',
        username: '',
        password: '',
        verifyPassword: '',
        verifyCode: ''
    })
    const [errors, setErrors] = useState<FormErrors>({})

    const { mutateAsync: registerMutation, isPending, error } = useRegister()

    const handleChange = (field: keyof FormDataType) => (value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!formData.username) {
            newErrors.username = 'Username is required'
        } else if (formData.username.length < 8) {
            newErrors.username = 'Username must be at least 8 characters'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        if (!formData.verifyPassword) {
            newErrors.verifyPassword = 'Please confirm your password'
        } else if (formData.password !== formData.verifyPassword) {
            newErrors.verifyPassword = 'Passwords do not match'
        }

        if (!formData.verifyCode) {
            newErrors.verifyCode = 'Verification code is required'
        } else if (formData.verifyCode.length !== 6) {
            newErrors.verifyCode = 'Verification code must be 6 digits'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        await registerMutation({
            email: formData.email,
            username: formData.username,
            password: formData.password,
        })
    }

    return (
        <main className="flex h-screen">
            <aside className="hidden md:flex bg-blue-500 min-h-20 md:flex-4 flex-1" aria-hidden="true" />
            <section className="mx-8 md:px-20 login-form flex-3 flex flex-col w-full max-w-xl">
                <header className="logo flex gap-2 items-center mt-3 justify-end">
                    <img src={GOOGLE_LOGO} alt="logo" className="h-6" />
                    <p className="text-2xl font-extrabold">Reely</p>
                </header>

                <div className="shrink my-auto flex flex-col gap-8">
                    <h1 className="text-4xl font-extrabold text-center">Sign Up</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error instanceof Error ? error.message : 'Registration failed. Please try again.'}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FormInput
                            label="Email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange("email")}
                            error={errors.email}
                        />
                        <FormInput
                            label="Username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange("username")}
                            error={errors.username}
                        />
                        <FormInput
                            label="Password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange("password")}
                            error={errors.password}
                        />
                        <FormInput
                            label="Verify Password"
                            type="password"
                            placeholder="Verify Password"
                            value={formData.verifyPassword}
                            onChange={handleChange("verifyPassword")}
                            error={errors.verifyPassword}
                        />
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <FormInput
                                    label="Verify code"
                                    placeholder="Enter the 6-digit code"
                                    value={formData.verifyCode}
                                    onChange={handleChange("verifyCode")}
                                    error={errors.verifyCode}
                                />
                            </div>
                            <button
                                type="button"
                                className="text-black font-semibold border flex-1 border-gray-200 rounded-md h-12 mt-auto"
                            >
                                Send code
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="py-3 px-4 bg-primary rounded-md text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Sign up"
                        >
                            {isPending ? 'Signing up...' : 'Sign up'}
                        </button>
                    </form>
                    <p className="text-center text-xs text-gray-500">By continuing with an account located in Vietnam, you agree to the Terms of Service and acknowledge that you have read out Privacy Policy.</p>
                </div>

            </section>

        </main>
    )
}

export default RegisterPage