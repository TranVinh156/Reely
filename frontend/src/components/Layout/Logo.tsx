import logo from "../../assets/logo.png";


const Logo = () => {
    return (
        <div className="w-full flex justify-center">
            <div className='flex items-center gap-2 w-fit'>
                <img src={logo} alt="Logo" className="w-12 h-12 filter brightness-0 invert" />
                <p className='font-black hidden md:flex text-3xl text-white'>Reely</p>
            </div>
        </div>
    )
}

export default Logo