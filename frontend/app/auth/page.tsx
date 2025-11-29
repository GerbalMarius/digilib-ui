"use client";

import { useState } from "react";
import Image from "next/image";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);

    const isLogin = activeTab === "login";

    function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-6xl rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md border border-amber-100 overflow-hidden flex flex-col md:flex-row scale-[1.03]">

                <aside className="md:w-5/12 bg-linear-to-br from-amber-200 via-amber-300 to-amber-400 text-slate-900 px-8 py-10 flex flex-col justify-center">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
                        {isLogin ? "Welcome back" : "Create your account"}
                    </h2>
                    <p className="text-base md:text-lg opacity-80">
                        {isLogin
                            ? "Log in to access your digital library account."
                            : "Join Digilib and start using the available digital libraries and books."}
                    </p>
                </aside>

                {/* RIGHT CONTENT */}
                <main className="flex-1 px-6 md:px-10 py-8 md:py-10 flex flex-col">
                    {/* TABS */}
                    <div className="relative mb-12">
                        <div className="bg-amber-50 rounded-full flex relative h-14 items-center px-1">
                            <div
                                className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-amber-600/90 transition-transform duration-300 ease-out ${isLogin ? "translate-x-0" : "translate-x-full"}`}
                            />
                            <button
                                type="button"
                                className={`hover:cursor-pointer 
                                    relative z-10 flex-1 
                                    text-base md:text-lg font-semibold ${isLogin ? "text-white" : "text-amber-700"}`}
                                onClick={() => setActiveTab("login")}
                            >
                                Log in
                            </button>
                            <button
                                type="button"
                                className={`hover:cursor-pointer 
                                    relative z-10 flex-1 
                                    text-base md:text-lg font-semibold ${!isLogin ? "text-white" : "text-amber-700"}`}
                                onClick={() => setActiveTab("register")}
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* FORMS WRAPPER */}
                    <div className="relative flex-1">
                        {/* LOGIN FORM */}
                        <form
                            onSubmit={handleLoginSubmit}
                            className={`space-y-5 transition-all duration-300 ${isLogin
                                ? "opacity-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
                                }`}
                        >
                            <div>
                                <label className="block text-md md:text-lg font-medium text-slate-800 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email..."
                                    required
                                    className="
                                    font-medium
                                    w-full rounded-xl border border-amber-200 px-4 py-3.5 text-base md:text-lg
                                    bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-md md:text-lg font-medium text-slate-800 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showLoginPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password..."
                                        required
                                        className="w-full 
                                        font-medium
                                        rounded-xl border border-amber-200 px-4 py-3.5 text-base md:text-lg
                                      bg-white/80 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginPassword((v) => !v)}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center justify-center"
                                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
                                    >
                                        <Image
                                            src={showLoginPassword ? "/img/eye-open.svg" : "/img/eye-closed.svg"}
                                            alt=""
                                            width={30}
                                            height={30}
                                            className="opacity-80 hover:opacity-100 transition-opacity pointer-events-none"
                                        />
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="
                                hover:cursor-pointer
                                mt-4 w-full rounded-xl bg-amber-700 text-white font-semibold py-2.5 text-sm md:text-base shadow-md hover:bg-amber-600 transition-colors"
                            >
                                Log in
                            </button>
                        </form>

                        {/* REGISTER FORM */}
                        <form
                            onSubmit={handleRegisterSubmit}
                            className={`space-y-4 transition-all duration-300 ${!isLogin
                                ? "opacity-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
                                }`}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-800 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your name"
                                        required
                                        className="w-full rounded-xl border border-amber-200 px-3 py-2.5 text-sm md:text-base bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-800 mb-1">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Your last name"
                                        required
                                        className="w-full rounded-xl border border-amber-200 px-3 py-2.5 text-sm md:text-base bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="registerEmail"
                                    placeholder="you@example.com"
                                    required
                                    className="w-full rounded-xl border border-amber-200 px-3 py-2.5 text-sm md:text-base bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showRegPassword ? "text" : "password"}
                                        name="registerPassword"
                                        placeholder="Create a password"
                                        required
                                        className="w-full rounded-xl border border-amber-200 px-3 py-2.5 text-sm md:text-base bg-white/80 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRegPassword((v) => !v)}
                                        className="absolute inset-y-0 right-0 px-4 flex items-center justify-center"
                                        aria-label={showRegPassword ? "Hide password" : "Show password"}
                                    >
                                        <Image
                                            src={showRegPassword ? "/img/eye-open.svg" : "/img/eye-closed.svg"}
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="opacity-80 hover:opacity-100 transition-opacity pointer-events-none"
                                        />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-800 mb-1">
                                    Repeat password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showRegPassword ? "text" : "password"}
                                        name="registerPasswordRepeat"
                                        placeholder="Repeat your password"
                                        required
                                        className="w-full rounded-xl border border-amber-200 
                                        px-3 py-2.5 text-sm md:text-base bg-white/80 pr-10 
                                        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRegPassword((v) => !v)}
                                        className="absolute inset-y-0 right-0 px-4 flex items-center justify-center"
                                        aria-label={showRegPassword ? "Hide repeat password" : "Show repeat password"}
                                    >
                                        <Image
                                            src={showRegPassword ? "/img/eye-open.svg" : "/img/eye-closed.svg"}
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="opacity-80 hover:opacity-100 transition-opacity pointer-events-none"
                                        />
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-3 w-full rounded-xl bg-amber-700 text-white font-semibold py-2.5 text-sm md:text-base shadow-md hover:bg-amber-600 transition-colors"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AuthPage;
