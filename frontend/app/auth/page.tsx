"use client";

import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "../lib/auth-context";
import { getErrorMessagesFromError } from "../lib/http-error";
import { useRouter } from "next/navigation";
import Spinner from "../ui/Spinner";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const isLogin = activeTab === "login";

    const router = useRouter();

    const [isRegisterSubmitting, setRegisterSubmitting] = useState(false);
    const [isLoginSubmitting, setLoginSubmitting] = useState(false);

    const [loginErrors, setLoginErrors] = useState<string[]>([]);
    const [registerErrors, setRegisterErrors] = useState<string[]>([]);

    const { login, register, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/user");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <Spinner />;

    }
    if (isAuthenticated) return null;

    async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoginSubmitting(true);
        setLoginErrors([]);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await login(email, password);
            setLoginErrors([]);
        } catch (err) {
            const messages = getErrorMessagesFromError(err, {
                invalidCredentialsMessage:
                    "Bad credentials. Please check your email and password.",
            });
            setLoginErrors(messages);
        } finally {
            setLoginSubmitting(false);
        }
    }

    async function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setRegisterSubmitting(true);
        setRegisterErrors([]);

        const formData = new FormData(e.currentTarget);
        const firstName = (formData.get("name") as string)
        const lastName = (formData.get("lastName") as string) // if needed
        const email = formData.get("registerEmail") as string;
        const password = formData.get("registerPassword") as string;
        const passwordConfirmation = formData.get("registerPasswordRepeat") as string;

        const adminCode = formData.get("adminCode") as string || undefined;

        if (password !== passwordConfirmation) {
            setRegisterErrors(["Passwords do not match."]);
            setRegisterSubmitting(false);
            return;
        }

        try {
            await register({
                email,
                firstName,
                lastName,
                password,
                passwordConfirmation,
                adminCode
            });
            // optional success behavior
        } catch (err) {
            const messages = getErrorMessagesFromError(err, {
                defaultMessage: "Unable to register. Please try again.",
            });
            setRegisterErrors(messages);
        } finally {
            setRegisterSubmitting(false);
        }
    }

    const handleTabChange = (tab: "login" | "register") => {
        setActiveTab(tab);
        setLoginErrors([]);
        setRegisterErrors([]);
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-6xl rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md border border-amber-100 overflow-hidden flex flex-col md:flex-row scale-[1.03]">
                {/* LEFT SIDEBAR */}
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
                                className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-amber-600/90 transition-transform duration-300 ease-out ${isLogin ? "translate-x-0" : "translate-x-full"
                                    }`}
                            />
                            <button
                                type="button"
                                className={`hover:cursor-pointer relative z-10 flex-1 text-base md:text-lg font-semibold ${isLogin ? "text-white" : "text-amber-700"
                                    }`}
                                onClick={() => handleTabChange("login")}
                            >
                                Log in
                            </button>
                            <button
                                type="button"
                                className={`hover:cursor-pointer relative z-10 flex-1 text-base md:text-lg font-semibold ${!isLogin ? "text-white" : "text-amber-700"
                                    }`}
                                onClick={() => handleTabChange("register")}
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* FORMS */}
                    <div className="relative flex-1">
                        <LoginForm
                            isActive={isLogin}
                            isSubmitting={isLoginSubmitting}
                            onSubmit={handleLoginSubmit}
                            errors={loginErrors}
                        />
                        <RegisterForm
                            isActive={!isLogin}
                            isSubmitting={isRegisterSubmitting}
                            onSubmit={handleRegisterSubmit}
                            errors={registerErrors}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AuthPage;
