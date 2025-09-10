import { useEffect } from "react";
import { Minus, Square, X } from "lucide-react";
import logo from '../../assets/logos/logo.png'
export default function TitleBar() {
    useEffect(() => {
        // Attach click events once component mounts
        const minBtn = document.getElementById("min-btn");
        const maxBtn = document.getElementById("max-btn");
        const closeBtn = document.getElementById("close-btn");

        if (window.electronAPI) {
            minBtn!.onclick = () => {
                window.electronAPI.minimize();
                console.log("Minimize button clicked");

            };
            maxBtn!.onclick = () => { window.electronAPI.maximize(); };
            closeBtn!.onclick = () => { window.electronAPI.close(); };
        }
    }, []);

    return (
        <>
            <div className="flex justify-between items-center bg-gray-300  px-4 py-2 select-none drag">
                {/* App Name */}
                <img src={logo} className="h-8" alt="Logo" />

                {/* Control Buttons */}
                <div className="flex gap-2 no-drag">
                    <button
                        id="min-btn"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700 transition"
                    >
                        <Minus size={16} className="text-gray-900" />
                    </button>
                    <button
                        id="max-btn"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700 transition"
                    >
                        <Square size={16} className="text-gray-900" />
                    </button>
                    <button
                        id="close-btn"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-600 transition"
                    >
                        <X size={16} className="text-gray-900" />
                    </button>
                </div>
            </div>
            <div className="h-[1px] w-full bg-gray-400"></div>
        </>
    );
}
