import AsideBar from "../../components/layout/AsideBar";
import { Outlet } from "react-router-dom";

export default function Home() {
    return (
        <div className="w-full h-full flex bg-gray-200">
            <AsideBar />
            <div className="flex-1 p-10 pb-10 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}
