// app/admin/login/page.tsx (or wherever you keep pages)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../../../ui/Spinner";
import { useAuth } from "../../../lib/auth-context";
import { getErrorMessagesFromError } from "../../../lib/http-error";
import { LoginFormValues, parseFormData } from "../../../lib/form-utils";
import AdminLoginForm from "./AdminLoginForm";

const AdminLoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [isSubmitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

    const formData = new FormData(e.currentTarget);
    const { email, password } = parseFormData<LoginFormValues>(formData, {
      email: { key: "email" },
      password: { key: "password" },
    });

    try {
      await login(email, password);
      setErrors([]);
    } catch (err) {
      const messages = getErrorMessagesFromError(err, {
        invalidCredentialsMessage:
          "Invalid credentials. Please check your email and password.",
      });
      setErrors(messages);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-sm px-8 py-8">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          Admin sign in
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Use your administrative credentials to access the console.
        </p>

        <AdminLoginForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default AdminLoginPage;
