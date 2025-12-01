"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../../../ui/Spinner";
import { useAuth } from "../../../lib/auth-context";
import { getErrorMessagesFromError } from "../../../lib/http-error";
import { RegisterFormValues, parseFormData } from "../../../lib/form-utils";
import AdminRegisterForm from "./AdminRegisterForm";

type AdminRegisterFormValues = RegisterFormValues & {
  adminCode: string;
};

const AdminRegisterPage = () => {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [isSubmitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
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

    const {
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
      adminCode,
    } = parseFormData<AdminRegisterFormValues>(formData, {
      firstName: { key: "firstName" },
      lastName: { key: "lastName" },
      email: { key: "email" },
      password: { key: "password" },
      passwordConfirmation: { key: "passwordConfirmation" },
      adminCode: { key: "adminCode" },
    });

    if (password !== passwordConfirmation) {
      setErrors(["Passwords do not match."]);
      setSubmitting(false);
      return;
    }

    try {
      await register({
        email,
        firstName,
        lastName,
        password,
        passwordConfirmation,
        adminCode,
      });
      // optional redirect: router.replace("/admin");
    } catch (err) {
      const messages = getErrorMessagesFromError(err, {
        defaultMessage: "Unable to create admin account. Please try again.",
      });
      setErrors(messages);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 md:px-8">
      <div className="w-full max-w-3xl rounded-3xl bg-white/90 border border-amber-100 shadow-xl px-6 md:px-10 py-8 md:py-10">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">
          Admin registration 
        </h1>
        <p className="text-sm md:text-base text-slate-500 mb-6">
          Enter credentials to receive administrative access account
        </p>

        <AdminRegisterForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default AdminRegisterPage;
