"use client";

import { useState } from "react";
import Spinner from "../../../ui/Spinner";
import Eye from "../../../ui/Eye";

interface AdminRegisterFormProps {
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: string[];
}

const AdminRegisterForm = ({ isSubmitting, onSubmit, errors }: AdminRegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Error box */}
      {errors && errors.length > 0 && (
        <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold mb-1">Unable to create admin account:</p>
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
            First name
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            required
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Last name
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            required
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="admin@example.com"
          required
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="At least 10 characters, incl. digits, upper case and special characters"
            required
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white pr-11 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
          <Eye
            isClosed={!showPassword}
            onClickAction={() => setShowPassword(v => !v)}
            width={22}
            height={22}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="passwordConfirmation"
            placeholder="Repeat your password"
            required
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white pr-11 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
          <Eye
            isClosed={!showPassword}
            onClickAction={() => setShowPassword(v => !v)}
            width={22}
            height={22}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Admin code
        </label>
        <input
          type="text"
          name="adminCode"
          placeholder="Enter admin invitation / authorization code"
          required
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500">
          This code is required to register an administrative account.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`relative mt-2 w-full rounded-lg bg-slate-900 text-white text-sm font-semibold py-2.5
        shadow-sm transition-colors hover:bg-slate-800
        disabled:opacity-70 disabled:cursor-not-allowed`}
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
