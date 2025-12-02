"use client";

import { useState } from "react";
import Spinner from "../../ui/Spinner";
import Eye from "../../ui/Eye";

interface AdminRegisterFormProps {
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: string[];
}

const AdminRegisterForm = ({
  isSubmitting,
  onSubmit,
  errors,
}: AdminRegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClasses =
    "w-full rounded-xl border border-amber-300 px-4 py-3.5 text-base md:text-lg " +
    "bg-white/90 font-medium text-slate-900 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 md:space-y-6 w-full"
    >
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <div>
          <label className="block text-md md:text-lg font-medium text-slate-800 mb-1">
            First name
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-md md:text-lg font-medium text-slate-800 mb-1">
            Last name
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className="block text-md md:text-lg font-medium text-slate-800 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="admin@example.com"
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label className="block text-md md:text-lg font-medium text-slate-800 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="At least 10 characters, incl. digits, upper case & special characters"
            required
            className={`${inputClasses} pr-12`}
          />
          <Eye
            isClosed={showPassword}
            onClickAction={() => setShowPassword((v) => !v)}
            width={28}
            height={28}
          />
        </div>
      </div>

      <div>
        <label className="block text-md md:text-lg font-medium text-slate-800 mb-1">
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="passwordConfirmation"
            placeholder="Repeat your password"
            required
            className={`${inputClasses} pr-12`}
          />
          <Eye
            isClosed={showPassword}
            onClickAction={() => setShowPassword((v) => !v)}
            width={28}
            height={28}
          />
        </div>
      </div>

      <div>
        <label className="block text-md md:text-lg font-medium text-slate-800 mb-1">
          Admin code
        </label>
        <input
          type="text"
          name="adminCode"
          placeholder="Enter admin invitation / authorization code"
          required
          className={inputClasses}
        />
        <p className="mt-1 text-xs md:text-sm text-slate-500">
          This code is required to register an administrative account.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`hover:${
          isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
        } 
        relative mt-3 w-full rounded-xl 
        bg-amber-800 text-white font-semibold py-3.5 
        text-base md:text-lg shadow-md transition-colors
        hover:bg-amber-700
        disabled:opacity-75 disabled:cursor-not-allowed`}
      >
        <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
          Create admin account
        </span>
        {isSubmitting && <Spinner inline />}
      </button>
    </form>
  );
};

export default AdminRegisterForm;
