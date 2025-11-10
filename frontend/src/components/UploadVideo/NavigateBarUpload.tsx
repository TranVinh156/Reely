import React from "react";
import logo from "../../assets/logo.png";
import testAvatar from "../../assets/testAvatar.jpeg";


const NavigateBarUpload: React.FC = () => {
    return (
        <nav className="flex items-center justify-between p-4 bg-[#181C32] text-white ">
            <div className="flex items-center justify-between w-full px-2">
                <div className="flex  cursor-pointer">
                    <img src={logo} alt="Logo" className="w-9 h-9 filter brightness-0 invert"/>
                    <h2 className="text-3xl font-bold">Reely</h2>
                </div>
                
                <div className="flex flex-col justify-cente  cursor-pointer">
                    <img src={testAvatar} alt="User Avatar" className="w-10 h-10 rounded-full flex-shrink-0 object-cover border-2 border-gray-300"/>
                </div>
            </div>
        </nav>
    );
}

export default NavigateBarUpload;