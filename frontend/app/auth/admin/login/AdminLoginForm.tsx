// app/admin/login/AdminLoginForm.tsx (or wherever you keep it)
"use client";

import { useState } from "react";
import Link from "next/link";
import Spinner from "../../../ui/Spinner";
import Eye from "../../../ui/Eye";

interface AdminLoginFormProps {
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: string[];
}

const AdminLoginForm = ({ isSubmitting, onSubmit, errors }: AdminLoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClasses =
    "w-full rounded-xl border border-amber-300/70 bg-amber-950/5 px-4 py-3 text-sm " +
    "text-slate-900 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Error box */}
      {errors && errors.length > 0 && (
        <div className="mb-2 rounded-xl border border-red-300/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 shadow-sm">
          <p className="font-semibold mb-1">Unable to sign you in:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold tracking-wide text-slate-700 mb-1 uppercase">
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
        <label className="block text-xs font-semibold tracking-wide text-slate-700 mb-1 uppercase">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            required
            className={`${inputClasses} pr-11`}
          />
          <Eye
            isClosed={!showPassword}
            onClickAction={() => setShowPassword((v) => !v)}
            width={22}
            height={22}
          />
        </div>
      </div>

      {/* 🔗 Registration link above button */}
      <p className="text-xs text-slate-500">
        Don&apos;t have an admin account yet?{" "}
        <Link
          href="/admin/register"
          className="font-semibold text-amber-800 hover:text-amber-700"
        >
          Create one here
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="relative mt-1 w-full rounded-xl bg-amber-900 text-amber-50 text-sm font-semibold py-3
        shadow-md shadow-amber-900/30 transition-colors
        hover:bg-amber-800
        disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
          Sign in as admin
        </span>
        {isSubmitting && <Spinner inline />}
      </button>
    </form>
  );
};

export default AdminLoginForm;
