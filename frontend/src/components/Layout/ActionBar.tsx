import { useAuth } from "@/hooks/auth/useAuth"
import useLogout from "@/hooks/auth/useLogout"
import { STORAGE_URL } from "@/utils/constant"
import { LogOut, Upload, User, UserIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"

const ActionBar = () => {
    const { user, isAuthenticated } = useAuth()
    const location = useLocation()

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const { mutateAsync: logoutMutation } = useLogout()
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false)
            }
        }

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isModalOpen])

    if (!isAuthenticated) {
        return (
            <NavLink to="/login" className="fixed top-4 right-8 z-50">
                <p className="bg-gray-700 rounded-3xl flex items-center py-2 px-5 gap-2 font-semibold cursor-pointer">
                    <UserIcon size={20} />
                    Sign in
                </p>
            </NavLink>
        )
    }

    const handleLogout = async () => {
        console.log('Log out')
        await logoutMutation()
    }

    return (
        <div className="fixed top-4 right-4 md:right-8 z-50" ref={modalRef}>
            <div className="bg-gray-700 rounded-4xl flex items-center p-1.5 gap-3">
                {location.pathname !== '/upload' && (
                    <NavLink to="/upload" className="hidden lg:flex gap-1.5 text-sm items-center font-semibold hover:bg-gray-500 p-2 rounded-4xl cursor-pointer">
                        <Upload size={16} />
                        Upload
                    </NavLink>
                )}
                <button className="lg:p-1 rounded-3xl w-10 h-10 bg-gray-500 cursor-pointer" onClick={() => setIsModalOpen(!isModalOpen)}>
                    {!user?.avatarUrl ?
                        <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
                            <UserIcon className="text-black" size={18} />
                        </div>
                        :
                        <img src={`${STORAGE_URL}/${user?.avatarUrl}`} alt={user?.username} className="w-full h-full rounded-full object-cover" />
                    }
                </button>
            </div>
            {isModalOpen &&
                <div className="bg-gray-600 rounded-xl border border-gray-400 text-sm font-semibold cursor-pointer p-1 text-white">
                    <NavLink to="/upload" className="lg:hidden flex py-3 items-center text-center gap-3 hover:bg-gray-700 rounded-xl px-3">
                        <Upload size={20} />
                        Upload
                    </NavLink>
                    <NavLink to={`/users/${user?.username}`} className="flex py-3 items-center text-center gap-3 hover:bg-gray-700 rounded-xl px-3">
                        <UserIcon size={20} />
                        View Profile
                    </NavLink>
                    <div className="flex py-3 items-center gap-3 hover:bg-gray-700 rounded-xl px-3" onClick={handleLogout}>
                        <LogOut size={20} />
                        Logout
                    </div>
                </div>}
        </div>
    )
}

export default ActionBar