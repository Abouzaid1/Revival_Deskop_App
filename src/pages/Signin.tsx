import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import logo from "../assets/logos/logo.png";
import theme from "../constants/colors";
import auth from "../apis/auth";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (e: React.FormEvent) => {
        if (!username || !password) {
            // alert("يرجى ملء جميع الحقول");
            window.electronAPI.showAlert("يرجى ملء جميع الحقول");
            return;
        };
        e.preventDefault();
        const signed = auth.signIn(username, password);
        if (signed) {
            // Handle successful sign-in (e.g., redirect, update state)
            console.log("Sign-in successful");
        } else {
            // Handle failed sign-in (e.g., show error message)
            console.log("Sign-in failed");
        }
        location.reload();
    }
    return (
        <div
            className="min-h-screen flex items-center bg-white justify-center"

            dir="rtl"
        >
            <div

                className="backdrop-blur-lg  rounded-2xl flex w-full max-w-4xl overflow-hidden border border-white/30"
                style={{ background: theme.surface }}
            >
                {/* Left: Form */}
                <div className="flex-1 flex flex-col justify-center px-12 py-16 gap-8">
                    <h2

                        className="text-4xl font-extrabold mb-4 text-right"
                        style={{ color: theme.primary }}
                    >
                        تسجيل الدخول
                    </h2>

                    {/* Username */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="username"
                            className="text-sm font-medium text-gray-700 text-right"
                        >
                            اسم المستخدم
                        </label>
                        <div className="relative">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-xl pr-12 pl-4 py-3 focus:outline-none transition-all duration-300 text-right bg-white shadow-md placeholder-gray-400 focus:ring-4"
                                placeholder="ادخل اسم المستخدم"
                                required
                            />
                            <FiUser
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
                                style={{ color: theme.primary }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700 text-right"
                        >
                            كلمة المرور
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl pr-12 pl-4 py-3 focus:outline-none transition-all duration-300 text-right bg-white shadow-md placeholder-gray-400 focus:ring-4"
                                placeholder="ادخل كلمة المرور"
                                required
                            />
                            <FiLock
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
                                style={{ color: theme.primary }}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full mt-4 font-bold py-3 rounded-xl bg-gray-600 text-white shadow-lg text-lg tracking-wide transition-all duration-300"

                    >
                        دخول
                    </button>
                </div>

                {/* Right: Logo */}
                <div

                    className="hidden md:flex flex-col items-center justify-center bg-gray-300 flex-1 p-10"

                >
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-56 h-56 object-contain drop-shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
