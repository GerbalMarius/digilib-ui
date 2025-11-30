"use client";

import { useState } from "react";
import Image from "next/image";

interface LoginFormProps {
  isActive: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({ isActive, onSubmit }: LoginFormProps) => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-5 transition-all duration-300 ${
        isActive
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
          className="font-medium w-full rounded-xl border border-amber-200 px-4 py-3.5 text-base md:text-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
            className="w-full font-medium rounded-xl border border-amber-200 px-4 py-3.5 text-base md:text-lg bg-white/80 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
        className="hover:cursor-pointer mt-4 w-full rounded-xl bg-amber-700 text-white font-semibold py-3.5 text-base md:text-lg shadow-md hover:bg-amber-600 transition-colors"
      >
        Log in
      </button>
    </form>
  );
};

export default LoginForm;
