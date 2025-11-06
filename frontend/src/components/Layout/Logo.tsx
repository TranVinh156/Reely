import LogoImage from '@/assets/logo.png'


const Logo = () => {
    return (
        <div className='flex items-center pl-14 gap-2'>
            <img className="w-10" src={LogoImage} alt="logo" />
            <p className='font-bold text-2xl text-white'>Reely</p>
        </div>
    )
}

export default Logo