'use client';

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import { axiosClient } from "../lib/axios-client";
import Spinner from "../ui/Spinner";
import { getErrorMessagesFromError } from "../lib/http-error";
import { useToast } from "../lib/toast-context";
import DashBoardSidebar from "../ui/DashBoardSidebar";

interface UpdateFormState {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirmation: string;
};

const UserPage = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();

    const { showToast } = useToast();


    const inputClasses =
        "w-full rounded-xl border border-amber-200 px-4 py-3 text-base bg-white/80 " +
        "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500";

    const [form, setForm] = useState<UpdateFormState>({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        passwordConfirmation: "",
    });

    const [activeSection, setActiveSection] = useState<"profile" | "password">(
        "profile"
    );

    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/auth");
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                email: user.email ?? "",
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? ""
            }));
        }
    }, [user]);

    if (isLoading) {
        return <Spinner />;
    }

    if (!isAuthenticated || !user) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenConfirm = (e: FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setSuccessMessage(null);

        // simple front-end check for password match
        if (form.password && form.password !== form.passwordConfirmation) {
            setErrors(["Passwords do not match."]);
            setActiveSection("password");
            return;
        }

        setShowConfirm(true);
    };

    const handleConfirmUpdate = async () => {
        if (!user) return;

        setIsSubmitting(true);
        setErrors([]);
        setSuccessMessage(null);

        try {
            const payload: any = {};

            if (form.email && form.email !== user.email) {
                payload.email = form.email;
            }

            const currentFirst = user.firstName ?? "";
            const newFirst = form.firstName.trim();
            if (newFirst && newFirst !== currentFirst) {
                payload.firstName = newFirst;
            }

            const currentLast = user.lastName ?? "";
            const newLast = form.lastName.trim();
            if (newLast && newLast !== currentLast) {
                payload.lastName = newLast;
            }

            if (form.password) {
                payload.password = form.password;
                payload.passwordConfirmation = form.passwordConfirmation;
            }

            if (Object.keys(payload).length === 0) {
                setErrors(["Nothing to update. Change at least one field."]);
                setShowConfirm(false);
                setIsSubmitting(false);
                return;
            }

            await axiosClient.patch(`/users/${user.id}`, payload);

            setSuccessMessage("Your account has been updated successfully.");
            setShowConfirm(false);
            setForm((prev) => ({
                ...prev,
                password: "",
                passwordConfirmation: "",
            }));
        } catch (err: any) {
            console.error(err);
            const messages = getErrorMessagesFromError(err, {
                defaultMessage:
                    "Unable to update your account. Please check the highlighted fields.",
            });
            setErrors(messages);
            setShowConfirm(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 flex">
            {/* LEFT SIDEBAR / MENU */}
            <DashBoardSidebar
                variant="user"
                title="Digilib"
                subtitle="Account settings"
                avatarText="D"
                links={[
                    {
                        id: "profile",
                        label: "Profile details",
                        iconSrc: "/img/account-white.svg",
                        active: activeSection === "profile",
                        onClick: () => setActiveSection("profile"),
                    },
                    {
                        id: "password",
                        label: "Password",
                        iconSrc: "/img/lock-white.svg",
                        active: activeSection === "password",
                        onClick: () => setActiveSection("password"),
                    },
                ]}
                onLogout={async () => {
                    await logout();
                    showToast("You’ve been logged out.", "info");
                    router.push("/");
                }}
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col">
                {/* TOP BAR */}
                <header className="h-16 px-4 sm:px-8 flex items-center justify-between bg-white/80 backdrop-blur border-b border-amber-100">
                    <div>
                        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                            Account settings
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Update your profile information and password.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/")}
                        className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-800 hover:bg-amber-100 transition"
                    >
                        ← Back to home
                    </button>
                </header>

                <section className="flex-1 px-4 sm:px-8 py-6 sm:py-8">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {/* MESSAGES */}
                        {errors.length > 0 && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                <p className="font-semibold mb-1">There was a problem:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    {errors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {successMessage && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                {successMessage}
                            </div>
                        )}

                        {/* FORM CARD */}
                        <div className="rounded-2xl bg-white shadow-md border border-amber-100 p-5 sm:p-6">
                            <form onSubmit={handleOpenConfirm} className="space-y-6">
                                {activeSection === "profile" && (
                                    <div className="space-y-4">
                                        <h2 className="text-base font-semibold text-slate-900">
                                            Profile details
                                        </h2>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    className={inputClasses}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    First name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={form.firstName}
                                                    onChange={handleChange}
                                                    placeholder="Optional"
                                                    className={inputClasses}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Last name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={form.lastName}
                                                    onChange={handleChange}
                                                    placeholder="Optional"
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === "password" && (
                                    <div className="space-y-4">
                                        <h2 className="text-base font-semibold text-slate-900">
                                            Change password
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Password must be at least 10 characters, and include an
                                            uppercase letter, a digit and a special character
                                            (according to your backend validator).
                                        </p>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    New password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Confirm new password
                                                </label>
                                                <input
                                                    type="password"
                                                    name="passwordConfirmation"
                                                    value={form.passwordConfirmation}
                                                    onChange={handleChange}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                                    <p className="text-xs text-slate-500">
                                        Changes are applied to your Digilib account and synced with
                                        your profile.
                                    </p>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-amber-600 active:scale-[0.98] transition"
                                    >
                                        Review &amp; update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* CONFIRMATION MODAL */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-amber-100 p-5 sm:p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">
                            Confirm account update
                        </h2>
                        <p className="text-sm text-slate-600 mb-4">
                            You&apos;re about to update your account details. Please confirm
                            that everything looks correct.
                        </p>

                        <ul className="text-sm text-slate-700 space-y-1 mb-4">
                            {form.email && form.email !== user.email && (
                                <li>
                                    <span className="font-semibold">Email:</span>{" "}
                                    {user.email} → {form.email}
                                </li>
                            )}
                            {form.firstName.trim() && form.firstName.trim() !== user.firstName.trim() && (
                                <li>
                                    <span className="font-semibold">First name:</span>{" "}
                                    {form.firstName}
                                </li>
                            )}
                            {form.lastName.trim() && form.lastName.trim() !== user.lastName.trim() && (
                                <li>
                                    <span className="font-semibold">Last name:</span>{" "}
                                    {form.lastName}
                                </li>
                            )}
                            {form.password && (
                                <li>
                                    <span className="font-semibold">Password:</span> will be
                                    updated
                                </li>
                            )}
                            {!(
                                (form.email && form.email !== user.email) ||
                                (form.firstName.trim() && form.firstName.trim() !== user.firstName.trim()) ||
                                (form.lastName.trim() && form.lastName.trim() !== user.lastName.trim()) ||
                                form.password
                            ) && (
                                    <li className="text-slate-500">
                                        You haven&apos;t changed any fields yet.
                                    </li>
                                )}
                        </ul>

                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmUpdate}
                                disabled={isSubmitting}
                                className="rounded-full bg-amber-700 px-5 py-1.5 text-sm font-semibold text-white shadow-md hover:bg-amber-600 disabled:opacity-70 disabled:cursor-not-allowed transition"
                            >
                                {isSubmitting ? "Updating..." : "Confirm update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

type MenuButtonProps = {
    active: boolean;
    label: string;
    icon: string;
    onClick: () => void;
};


export default UserPage;
