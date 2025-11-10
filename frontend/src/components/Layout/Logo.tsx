import LogoImage from '@/assets/logo.png'


const Logo = () => {
    return (
        <div className='flex items-center gap-2'>
            <img className="w-10 h-auto" src={LogoImage} alt="logo" />
            <p className='font-bold hidden md:flex text-2xl text-white'>Reely</p>
        </div>
    )
}

export default Logo