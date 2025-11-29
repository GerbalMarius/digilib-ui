"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {MenuState, NavBarProps} from "./navbar-types"


export default function NavBar({
    links,
    orientation = "horizontal",
    showLogo = true,
    brandName = "Digilib",
    logoSrc = "/img/logo.svg",
    showButton = false,
    buttonHref = "/auth",
}: NavBarProps) {
    const [menuState, setMenuState] = useState<MenuState>("closed");

    const [authOpen, setAuthOpen] = useState<boolean>(false);

    const btnRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLElement | null>(null);

    const isActive = menuState === "opening" || menuState === "open";
    const isVisible = menuState !== "closed";
    const isHorizontal = orientation === "horizontal";

    const handleToggle = () => {
        if (menuState === "closed" || menuState === "closing") {
            setMenuState("opening");
        } else {
            setMenuState("closing");
        }
    };

    const handleAnimationEnd = () => {
        if (menuState === "opening") setMenuState("open");
        if (menuState === "closing") setMenuState("closed");
    };

    // close on outside click
    useEffect(() => {
        if (menuState === "closed") return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (btnRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            setMenuState("closing");
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [menuState]);

    useEffect(() => {
        if (!authOpen) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (btnRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            setAuthOpen(false);
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [authOpen]);

    const desktopNavClasses = isHorizontal
        ? "hidden md:flex flex-row space-x-6 text-2xl md:text-3xl font-semibold items-center"
        : "hidden md:flex flex-col items-end space-y-4 text-2xl md:text-3xl font-semibold";

    return (
        <header>
            <nav className="relative container mx-auto p-6 font-heading text-4xl font-bold shadow-2xl rounded-4xl">
                <div className={`flex ${isHorizontal ? "flex row" : "flex col"} items-center justify-between`}>
                    {/* Logo */}
                    {showLogo ? (
                        <Link href="/">
                            <div className="pt-2 flex flex-row gap-2 cursor-pointer">
                                <Image src={logoSrc} alt="logo" width={50} height={50} />
                                <span className="font-heading text-4xl font-bold md:text-5xl">
                                    {brandName}
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <div className="w-20" />
                    )}

                    {/* Hamburger */}
                    <button
                        id="hamburger-button"
                        ref={btnRef}
                        className={`hamburger-btn md:hidden cursor-pointer ${isActive ? "toggle-btn" : ""
                            }`}
                        aria-expanded={isActive}
                        aria-label="Toggle menu"
                        onClick={handleToggle}
                    >
                        <div className="hamburger-line"></div>
                    </button>

                    {/* Desktop Nav */}
                    <div className={desktopNavClasses}>
                        {links
                            .filter(link => link.href !== '/auth')
                            .map(link => (
                                <Link key={link.href} href={link.href} className="underline-hover">
                                    {link.label}
                                </Link>
                            ))}

                        {/* AUTH DROPDOWN (desktop) */}
                        {showButton && (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setAuthOpen((prev) => !prev)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-700 text-white text-xl font-semibold hover:bg-amber-600 transition"
                                >
                                    <Image
                                        src="/img/account-white.svg"
                                        alt="user"
                                        width={40}
                                        height={40}
                                        className="opacity-90"
                                    />
                                    <Image
                                        src="/img/arrow-sm-down-white.svg"
                                        alt="arrow"
                                        width={40}
                                        height={40}
                                        className={`transition-transform duration-200 ${authOpen ? "rotate-180" : "rotate-0"
                                            }`}
                                    />
                                </button>

                                {authOpen && (
                                    <div className="absolute right-0 mt-3 w-40 rounded-xl bg-amber-50/95 
                                    dark:bg-amber-900/95 shadow-lg border border-amber-200/60 dark:border-amber-800/80 py-2
                                    transition-all duration-300 ease-out"
                                    >
                                        <Link
                                            href={buttonHref}
                                            onClick={() => setAuthOpen(false)}
                                            className="block px-4 py-2 text-base text-amber-900 dark:text-amber-50 hover:bg-amber-100/80 dark:hover:bg-amber-800/80 transition"
                                        >
                                            Login
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* MOBILE NAV*/}
                <section
                    id="mobile-menu"
                    ref={menuRef}
                    onAnimationEnd={handleAnimationEnd}
                    className={[
                        "md:hidden fixed inset-x-0 top-20 bottom-0 z-40",
                        "text-5xl text-slate-900 dark:text-white",
                        "origin-top backdrop-blur-md backdrop-saturate-150",
                        isVisible
                            ? "flex flex-col justify-start items-end pr-6 text-right"
                            : "hidden",
                        menuState === "opening"
                            ? "animate-[open-menu_0.5s_ease-in-out_forwards]"
                            : "",
                        menuState === "closing"
                            ? "animate-[close-menu_0.5s_ease-in-out_forwards]"
                            : "",
                    ].join(" ")}
                >
                    <nav
                        className="flex flex-col w-full h-full items-end justify-start"
                        aria-label="mobile"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="py-4 hover:opacity-90 underline-hover"
                                onClick={() => setMenuState("closing")}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </section>
            </nav>
        </header>
    );
}