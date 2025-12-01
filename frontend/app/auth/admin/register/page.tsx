// app/admin/login/page.tsx (or wherever you keep pages)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../../../ui/Spinner";
import { useAuth } from "../../../lib/auth-context";
import { getErrorMessagesFromError } from "../../../lib/http-error";
import { parseFormData, RegisterFormValues } from "../../../lib/form-utils";
import AdminRegisterForm from "./AdminRegisterForm";

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

        const {
            firstName,
            lastName,
            email,
            password,
            passwordConfirmation,
            adminCode,
        } = parseFormData<RegisterFormValues>(formData, {
            firstName: { key: "name" },
            lastName: { key: "lastName" },
            email: { key: "registerEmail" },
            password: { key: "registerPassword" },
            passwordConfirmation: { key: "registerPasswordRepeat" },
            adminCode: { key: "adminCode", optional: true },
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
                adminCode
            });
            // optional success behavior
        } catch (err) {
            const messages = getErrorMessagesFromError(err, {
                defaultMessage: "Unable to register. Please try again.",
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
