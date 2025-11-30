"use client";

import { useState } from "react";
import Image from "next/image";

interface RegisterFormProps {
  isActive: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterForm = ({ isActive, onSubmit }: RegisterFormProps) => {
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegRepeatPassword, setShowRegRepeatPassword] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-4 transition-all duration-300 ${isActive
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
            className="w-full rounded-xl border border-amber-200 px-4 py-3 text-base bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
            className="w-full rounded-xl border border-amber-200 px-4 py-3 text-base bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
          className="w-full rounded-xl border 
          border-amber-200 px-4 py-3 text-base bg-white/80 focus:outline-none 
          focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
            className="w-full rounded-xl border 
            border-amber-200 px-4 py-3 text-base 
            bg-white/80 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              width={24}
              height={24}
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
            type={showRegRepeatPassword ? "text" : "password"}
            name="registerPasswordRepeat"
            placeholder="Repeat your password"
            required
            className="w-full rounded-xl border 
            border-amber-200 px-4 py-3 text-base 
            bg-white/80 pr-12 focus:outline-none 
            focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => setShowRegRepeatPassword((v) => !v)}
            className="absolute inset-y-0 right-0 px-4 flex items-center justify-center"
            aria-label={
              showRegRepeatPassword
                ? "Hide repeat password"
                : "Show repeat password"
            }
          >
            <Image
              src={showRegRepeatPassword ? "/img/eye-open.svg" : "/img/eye-closed.svg"}
              alt=""
              width={24}
              height={24}
              className="opacity-80 hover:opacity-100 transition-opacity pointer-events-none"
            />
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="mt-3 w-full rounded-xl 
        bg-amber-700 text-white font-semibold py-3.5 
        text-base md:text-lg shadow-md hover:bg-amber-600 transition-colors"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
