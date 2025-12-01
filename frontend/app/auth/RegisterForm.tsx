"use client";

import { useState } from "react";
import Image from "next/image";
import Spinner from "../ui/Spinner";
import Eye from "../ui/Eye";
import { RegisterFormProps } from "./form-props";



const RegisterForm = ({
  isActive,
  isSubmitting,
  onSubmit,
  errors,
}: RegisterFormProps) => {
  const [showRegPassword, setShowRegPassword] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-4 transition-all duration-300 ${isActive
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
        }`}
    >
      {/* Error box */}
      {errors && errors.length > 0 && (
        <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold mb-1">
            There was a problem with your registration:
          </p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

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
          <Eye
            isClosed={showRegPassword}
            onClickAction={() => setShowRegPassword((v) => !v)}
            width={24}
            height={24}
          />
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
            className="w-full rounded-xl border 
            border-amber-200 px-4 py-3 text-base 
            bg-white/80 pr-12 focus:outline-none 
            focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
           <Eye
            isClosed={showRegPassword}
            onClickAction={() => setShowRegPassword((v) => !v)}
            width={24}
            height={24}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`hover:${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}
        relative mt-3 w-full rounded-xl 
        bg-amber-700 text-white font-semibold py-3.5 
        text-base md:text-lg shadow-md hover:bg-amber-600 transition-colors
        disabled:opacity-75 disabled:cursor-not-allowed`}
      >
        {/* Text fades out when loading */}
        <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
          Register
        </span>

        {/* Centered spinner overlay */}
        {isSubmitting && (
          <Spinner inline />
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
