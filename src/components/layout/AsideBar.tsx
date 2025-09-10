import { PiInvoiceBold } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function AsideBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "الفواتير", path: "/", icon: <PiInvoiceBold /> },
        { name: "الشركات", path: "/company-creation", icon: <FaBuilding /> },
    ];

    return (
        <div className="min-w-64 h-screen  bg-gray-200 flex flex-col">
            {/* Title */}
            <div className="p-6 ">
                <h2 className="text-xl font-bold text-center ">
                    القائمة الرئيسية
                </h2>
            </div>

            {/* Menu */}
            <ul className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <li
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300
                ${active
                                    ? "bg-gray-50 text-gray-800 shadow-xl scale-[1.02]"
                                    : "text-gray-700 hover:bg-gray-700  hover:text-white"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-semibold">{item.name}</span>
                        </li>
                    );
                })}
            </ul>


        </div>
    );
}
