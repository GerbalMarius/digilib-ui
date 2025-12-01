"use client";

import { useState } from "react";
import Spinner from "../ui/Spinner";

import Eye from "../ui/Eye";
import { LoginFormProps } from "./form-props";

const LoginForm = ({
  isActive,
  isSubmitting,
  onSubmit,
  errors,
}: LoginFormProps) => {
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
      {/* Error box */}
      {errors && errors.length > 0 && (
        <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold mb-1">There was a problem with your login:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

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
          <Eye
            isClosed={showLoginPassword}
            onClickAction={() => setShowLoginPassword((v) => !v)}
            width={30}
            height={30}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`hover:${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"} 
        relative mt-4 w-full rounded-xl bg-amber-700 text-white font-semibold
        py-3.5 text-base md:text-lg shadow-md transition-colors
        hover:bg-amber-600
        disabled:opacity-75 disabled:cursor-not-allowed`}
      >
        {/* Text fades out when loading */}
        <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
          Log in
        </span>

        {/* Centered spinner overlay */}
        {isSubmitting && (
          <Spinner inline/>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
