"use client";

import { useState } from "react";
import Link from "next/link";
import Spinner from "../../ui/Spinner";
import Eye from "../../ui/Eye";

interface AdminLoginFormProps {
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: string[];
}

const AdminLoginForm = ({ isSubmitting, onSubmit, errors }: AdminLoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 md:space-y-6 w-full"
    >
      {errors && errors.length > 0 && (
        <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold mb-1">
            There was a problem with your login:
          </p>
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
          placeholder="admin@example.com"
          required
          className="font-medium w-full rounded-xl border border-amber-300 px-4 py-3.5 text-base md:text-lg 
          bg-white/90 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700"
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
            placeholder="Enter your password..."
            required
            className="w-full font-medium rounded-xl border border-amber-300 px-4 py-3.5 text-base md:text-lg 
            bg-white/90 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700"
          />
          <Eye
            isClosed={showPassword}
            onClickAction={() => setShowPassword((v) => !v)}
            width={28}
            height={28}
          />
        </div>
      </div>

      <p className="text-xs md:text-sm text-slate-500">
        Don&apos;t have an admin account yet?{" "}
        <Link
          href="/auth/admin/register"
          className="font-semibold text-amber-700 hover:text-amber-800"
        >
          Create one here
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`hover:${
          isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
        } 
        relative mt-2 w-full rounded-xl bg-amber-800 text-white font-semibold
        py-3.5 text-base md:text-lg shadow-md transition-colors
        hover:bg-amber-700
        disabled:opacity-75 disabled:cursor-not-allowed`}
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
