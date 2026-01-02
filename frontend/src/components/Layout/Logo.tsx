import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";


const Logo = ({ collapsed, variant = 'light', className = "w-full" }: { collapsed?: boolean, variant?: 'light' | 'dark', className?: string }) => {
    return (
        <NavLink to={'/'} className={className}>
            <div className='flex items-center gap-2 w-fit'>
                <img
                    src={logo}
                    alt="Logo"
                    className={`w-12 h-12 filter brightness-0 ${variant === 'light' ? 'invert' : ''}`}
                />
                {!collapsed && (
                    <p className={`font-black hidden lg:flex text-3xl ${variant === 'light' ? 'text-white' : 'text-black'}`}>
                        Reely
                    </p>
                )}
            </div>
        </NavLink>
    )
}

export default Logo