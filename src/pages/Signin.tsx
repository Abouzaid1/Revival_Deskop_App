import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import logo from "../assets/logos/logo.png";
import theme from "../constants/colors";
import auth from "../apis/auth";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!username || !password) {
            window.electronAPI?.showAlert?.("يرجى ملء جميع الحقول");
            return;
        }
        setLoading(true);
        const signed = await auth.signIn(username, password);
        setLoading(false);
        if (signed) {
            // Handle successful sign-in (e.g., redirect, update state)
            location.reload();
        } else {
            console.log(signed);

            setError("اسم المستخدم أو كلمة المرور غير صحيحة");
        }
    }
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-white">
                <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    return (
        <div className="h-screen flex items-center bg-white justify-center" dir="rtl">
            <div className="backdrop-blur-lg  rounded-2xl flex w-full max-w-4xl overflow-hidden border border-white/30" style={{ background: theme.surface }}>
                {/* Left: Form */}
                <div className="flex-1 flex flex-col justify-center px-12 py-16 gap-8">
                    <h2 className="text-4xl font-extrabold mb-4 text-right" style={{ color: theme.primary }}>تسجيل الدخول</h2>
                    {error && (
                        <div className="mb-4 text-red-600 bg-red-100 rounded-lg px-4 py-2 text-right font-bold text-sm border border-red-200">
                            {error}
                        </div>
                    )}
                    {/* Username */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="text-sm font-medium text-gray-700 text-right">اسم المستخدم</label>
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
                            <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none" style={{ color: theme.primary }} />
                        </div>
                    </div>
                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 text-right">كلمة المرور</label>
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
                            <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none" style={{ color: theme.primary }} />
                        </div>
                    </div>
                    {/* Button */}
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full mt-4 font-bold py-3 rounded-xl bg-gray-600 text-white shadow-lg text-lg tracking-wide transition-all duration-300"
                        disabled={loading}
                    >
                        دخول
                    </button>
                </div>
                {/* Right: Logo */}
                <div className="hidden md:flex flex-col items-center justify-center bg-gray-300 flex-1 p-10">
                    <img src={logo} alt="Logo" className="w-56 h-56 object-contain drop-shadow-2xl" />
                </div>
            </div>
        </div>
    );
}
