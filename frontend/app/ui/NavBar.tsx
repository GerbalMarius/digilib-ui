"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuState, NavBarProps } from "./navbar-utils";
import { useAuth } from "../lib/auth-context";
import { useToast } from "../lib/toast-context";
import { usePathname } from "next/navigation";

const NavBar = ({ links,
  orientation = "horizontal",
  showLogo = true,
  brandName = "Digilib",
  logoSrc = "/img/logo.svg",
  showButton = false,
  buttonHref = "/auth", }: NavBarProps) => {

  const [menuState, setMenuState] = useState<MenuState>("closed");
  const [authOpen, setAuthOpen] = useState<boolean>(false);

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);

  const pathName = usePathname();
  const isBookStore = pathName === "/books";

  const isActive = menuState === "opening" || menuState === "open";
  const isVisible = menuState !== "closed";
  const isHorizontal = orientation === "horizontal";

  const { showToast } = useToast();


  const { isAuthenticated, user, logout } = useAuth();

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
    ? "hidden md:flex flex-row items-center justify-center gap-6 text-sm md:text-base font-semibold"
    : "hidden md:flex flex-col items-end gap-4 text-sm md:text-base font-semibold";
  return (
    <header className="sticky top-0 z-50 bg-linear-to-b from-amber-50/90 via-amber-50/60 to-transparent">
      <nav className="relative max-w-6xl mx-auto mt-4 mb-4 px-4 sm:px-6">
        <div className="flex items-center justify-between rounded-4xl bg-white/90 backdrop-blur border border-amber-100 shadow-xl px-4 sm:px-6 py-3">
          {/* Logo */}
          {showLogo ? (
            <Link href="/" className="shrink-0">
              <div className="flex flex-row items-center gap-2 cursor-pointer">
                <Image src={logoSrc} alt="logo" width={36} height={36} />
                <span className="font-heading text-xl md:text-2xl font-bold tracking-tight">
                  {brandName}
                </span>
              </div>
            </Link>
          ) : (
            <div className="w-20" />
          )}

          {/* Desktop nav + auth */}
          <div className="hidden md:flex items-center gap-6">
            <div className={desktopNavClasses}>
              {links
                .filter((link) => {
                  if (isBookStore) return link.href === "/";
                  return link.href !== "/auth";
                })
                .map((link) => {
                  const isBrowse = link.href === "/books";

                  if (isBrowse && isBookStore) return null;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={
                        isBrowse
                          ?
                          "px-7 py-2.5 rounded-full bg-amber-700 text-white shadow-lg text-base md:text-lg font-semibold " +
                          "hover:bg-amber-600 transition-all transform hover:-translate-y-0.5 hover:shadow-xl"
                          : "underline-hover text-slate-800 hover:text-amber-800 transition"
                      }
                    >
                      {link.label}
                    </Link>
                  );
                })}
            </div>
            {/* Auth dropdown (desktop) */}
            {showButton && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAuthOpen((prev) => !prev)}
                  className="flex items-center justify-center gap-2 rounded-full bg-amber-700 text-white text-sm font-semibold px-4 py-2 shadow-md hover:bg-amber-600 transition"
                >
                  <Image
                    src="/img/account-white.svg"
                    alt="user"
                    width={20}
                    height={20}
                    className="opacity-90"
                  />
                  <Image
                    src="/img/arrow-sm-down-white.svg"
                    alt="arrow"
                    width={18}
                    height={18}
                    className={`transition-transform duration-200 ${authOpen ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </button>

                {authOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-amber-50/95 
  shadow-lg border border-amber-200/80 py-2 text-sm">

                    {!isAuthenticated && (
                      <Link
                        href={buttonHref}
                        onClick={() => setAuthOpen(false)}
                        className="block px-4 py-2 text-amber-900 hover:bg-amber-100/80 transition"
                      >
                        Login
                      </Link>
                    )}

                    {isAuthenticated && (
                      <>
                        <div className="px-4 pb-2 text-xs text-amber-700 opacity-80">
                          {user?.email}
                        </div>

                        <Link
                          href="/user"
                          onClick={() => setAuthOpen(false)}
                          className="block px-4 py-2 text-amber-900 hover:bg-amber-100/80 transition"
                        >
                          User Page
                        </Link>

                        <button
                          onClick={async () => {
                            await logout();
                            showToast("You've been logged out", "info");
                            setAuthOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="hamburger-button"
            ref={btnRef}
            className={`md:hidden cursor-pointer hamburger-btn ${isActive ? "toggle-btn" : ""
              }`}
            aria-expanded={isActive}
            aria-label="Toggle menu"
            onClick={handleToggle}
          >
            <div className="hamburger-line" />
          </button>
        </div>

        {/* MOBILE NAV */}
        <section
          id="mobile-menu"
          ref={menuRef}
          onAnimationEnd={handleAnimationEnd}
          className={[
            "md:hidden fixed inset-x-0  top-16 bottom-0 z-40",
            "text-3xl text-slate-900",
            "origin-top backdrop-blur-md rounded-2xl backdrop-saturate-150 bg-amber-50/80",
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
            className="flex flex-col w-full h-full items-end justify-start pt-6 space-y-3"
            aria-label="mobile"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-2xl underline-hover"
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

export default NavBar;
