import React from 'react';

interface FormInputProps {
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    id?: string;
    name?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    required = false,
    className = '',
    id,
    name,
}) => {
    const safeLabel = label || '';
    const safeName = name || safeLabel;
    const inputId = id || `input-${safeName.toLowerCase().replace(/\s+/g, '-')}`;
    const [isFocused, setIsFocused] = React.useState(false);

    const showFloating = isFocused || value !== '';

    return (
        <div className={`form-input-wrapper flex flex-col relative ${className}`}>
            <div className="relative">
                <input
                    id={inputId}
                    name={safeName.toLowerCase().replace(/\s+/g, '-')}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full form-input ${error ? 'input-error' : ''} py-2 px-3 rounded-md border transition outline-none ${showFloating ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'} focus:border-blue-500`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                />

                <label
                    htmlFor={inputId}
                    className={`absolute left-3 ${showFloating ? '-top-2 text-xs text-blue-600 bg-white px-1 rounded-md' : 'hidden'}`}
                >
                    {label}
                </label>
            </div>

            {error && (
                <span
                    id={`${inputId}-error`}
                    className="form-error-message mt-1 text-sm text-red-600"
                >
                    {error}
                </span>
            )}
        </div>
    );
};

export default FormInput;