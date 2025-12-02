"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { axiosClient } from "../lib/axios-client";
import { useAuth } from "../lib/auth-context";
import Spinner from "../ui/Spinner";
import { getErrorMessagesFromError } from "../lib/http-error";
import { useToast } from "../lib/toast-context";
import { PageResponse, PageInfo } from "../lib/page-utils";
import type { User } from "../lib/auth-types";
import DashBoardSidebar from "../ui/DashBoardSidebar";

interface UpdateFormState {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
}

type AdminSection = "account" | "users";


const AdminDashboardPage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<AdminSection>("account");

  // Account form
  const [form, setForm] = useState<UpdateFormState>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    passwordConfirmation: "",
  });

  const [showConfirmAccount, setShowConfirmAccount] = useState(false);
  const [accountSubmitting, setAccountSubmitting] = useState(false);
  const [accountErrors, setAccountErrors] = useState<string[]>([]);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);

  // Users list / pagination
  const [usersPage, setUsersPage] = useState<PageResponse<User> | null>(
    null
  );
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // 0-based

  // Enable/disable modals
  const [userAction, setUserAction] = useState<{
    mode: "disable" | "enable";
    user: User | null;
  } | null>(null);
  const [userActionSubmitting, setUserActionSubmitting] = useState(false);

  const inputClasses =
    "w-full rounded-xl border border-slate-300 px-4 py-3 text-base bg-white/80 " +
    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500";

  const isAdmin =
    !!user?.roles?.some((r) => r === "ADMIN" || r === "ROLE_ADMIN");

  // Redirect non-authenticated / non-admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, isAuthenticated, isLoading, router]);

  // Prefill account form
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: user.email ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (activeSection !== "users" || !isAdmin) return;
    void fetchUsers(currentPage);
  }, [activeSection, currentPage, isAdmin]);

  const fetchUsers = async (pageIndex: number) => {
    setUsersLoading(true);
    setUsersError(null);

    try {
      const res = await axiosClient.get<PageResponse<User>>(
        "/users/all",
        {
          params: {
            page: pageIndex + 1, // backend expects 1-based
            sorts: ["id"],
          },
        }
      );

      setUsersPage(res.data);
      setPageInfo(res.data.page);
    } catch (err: any) {
      console.error(err);
      const messages = getErrorMessagesFromError(err, {
        defaultMessage: "Unable to load users list.",
      });
      setUsersError(messages.join(" "));
    } finally {
      setUsersLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner inline />
      </div>
    );
  }

  if (!isAuthenticated || !user || !isAdmin) return null;

  // --- Account section handlers ---

  const handleAccountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAccountConfirm = (e: FormEvent) => {
    e.preventDefault();
    setAccountErrors([]);
    setAccountSuccess(null);

    if (form.password && form.password !== form.passwordConfirmation) {
      setAccountErrors(["Passwords do not match."]);
      setActiveSection("account");
      return;
    }

    setShowConfirmAccount(true);
  };

  const handleConfirmAccountUpdate = async () => {
    if (!user) return;

    setAccountSubmitting(true);
    setAccountErrors([]);
    setAccountSuccess(null);

    try {
      const payload: any = {};

      // email – only if changed
      if (form.email && form.email !== user.email) {
        payload.email = form.email;
      }

      const currentFirst = user.firstName ?? "";
      const newFirst = form.firstName.trim();
      if (newFirst && newFirst !== currentFirst) {
        payload.firstName = newFirst;
      }

      const currentLast = user.lastName ?? "";
      const newLast = form.lastName.trim();
      if (newLast && newLast !== currentLast) {
        payload.lastName = newLast;
      }

      if (form.password) {
        payload.password = form.password;
        payload.passwordConfirmation = form.passwordConfirmation;
      }

      if (Object.keys(payload).length === 0) {
        setAccountErrors(["Nothing to update. Change at least one field."]);
        setShowConfirmAccount(false);
        setAccountSubmitting(false);
        return;
      }

      await axiosClient.patch(`/users/${user.id}`, payload);

      setAccountSuccess("Your admin account has been updated successfully.");
      setShowConfirmAccount(false);
      setForm((prev) => ({
        ...prev,
        password: "",
        passwordConfirmation: "",
      }));
      showToast("Account updated.", "success");
    } catch (err: any) {
      console.error(err);
      const messages = getErrorMessagesFromError(err, {
        defaultMessage:
          "Unable to update your account. Please check the highlighted fields.",
      });
      setAccountErrors(messages);
      setShowConfirmAccount(false);
    } finally {
      setAccountSubmitting(false);
    }
  };

  // --- User enable / disable handlers ---

  const openUserAction = (
    mode: "disable" | "enable",
    userRow: User
  ) => {
    setUserAction({ mode, user: userRow });
  };

  const handleConfirmUserAction = async () => {
    if (!userAction?.user) return;

    setUserActionSubmitting(true);
    try {
      const targetId = userAction.user.id;

      if (userAction.mode === "disable") {
        await axiosClient.delete(`/users/${targetId}/disable`);
        showToast("User has been disabled.", "success");
      } else {
        await axiosClient.put(`/users/${targetId}/enable`);
        showToast("User has been enabled.", "success");
      }



      // Re-fetch current page
      await fetchUsers(currentPage);
      setUserAction(null);
    } catch (err: any) {
      console.error(err);
      const messages = getErrorMessagesFromError(err, {
        defaultMessage: "Unable to update user status.",
      });
      showToast(messages.join(" "), "error");
    } finally {
      setUserActionSubmitting(false);
    }
  };

  const canGoPrev = pageInfo ? pageInfo.number > 0 : false;
  const canGoNext = pageInfo
    ? pageInfo.number + 1 < pageInfo.totalPages
    : false;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <DashBoardSidebar
        variant="admin"
        title="Digilib Admin"
        subtitle={user.firstName || user.email}
        avatarText="AD"
        links={[
          {
            id: "account",
            label: "Account",
            iconSrc: "/img/account-white.svg",
            active: activeSection === "account",
            onClick: () => setActiveSection("account"),
          },
          {
            id: "users",
            label: "Users",
            iconSrc: "/img/users-white.svg",
            active: activeSection === "users",
            onClick: () => setActiveSection("users"),
          },
        ]}
        onLogout={async () => {
          await logout();
          showToast("You’ve been logged out.", "info");
          router.push("/");
        }}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-16 px-4 sm:px-8 flex items-center justify-between bg-white/90 backdrop-blur border-b border-slate-200">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
              Admin dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your own account and library users.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            ← Back to home
          </button>
        </header>

        <section className="flex-1 px-4 sm:px-8 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* ACCOUNT SECTION */}
            {activeSection === "account" && (
              <>
                {accountErrors.length > 0 && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <p className="font-semibold mb-1">There was a problem:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {accountErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {accountSuccess && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {accountSuccess}
                  </div>
                )}

                <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 sm:p-6">
                  <form
                    onSubmit={handleOpenAccountConfirm}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h2 className="text-base font-semibold text-slate-900">
                        Account settings
                      </h2>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleAccountChange}
                            className={inputClasses}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            First name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleAccountChange}
                            className={inputClasses}
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Last name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleAccountChange}
                            className={inputClasses}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Password
                      </h3>
                      <p className="text-xs text-slate-500">
                        Leave blank if you don&apos;t want to change it.
                        Password must be at least 10 characters and include an
                        uppercase letter, a digit and a special character.
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            New password
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleAccountChange}
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Confirm new password
                          </label>
                          <input
                            type="password"
                            name="passwordConfirmation"
                            value={form.passwordConfirmation}
                            onChange={handleAccountChange}
                            className={inputClasses}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                      <p className="text-xs text-slate-500">
                        Changes apply to your admin account across Digilib.
                      </p>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-amber-600 active:scale-[0.98] transition"
                      >
                        Review &amp; update
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* USERS SECTION */}
            {activeSection === "users" && (
              <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Users
                    </h2>
                    <p className="text-xs text-slate-500">
                      Enable or disable reader accounts.
                    </p>
                  </div>
                </div>

                {usersLoading && (
                  <div className="py-10 flex justify-center">
                    <Spinner />
                  </div>
                )}

                {usersError && (
                  <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {usersError}
                  </div>
                )}

                {!usersLoading && usersPage && (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm md:text-base border-t border-b border-slate-100">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700">
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Email</th>
                            <th className="text-left px-4 py-3">Roles</th>
                            <th className="text-left px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersPage.content.map((u) => {
                            const fullName =
                              (u.firstName || u.lastName)
                                ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                                : "—";

                            return (
                              <tr
                                key={u.id}
                                className="border-t border-slate-100 hover:bg-slate-50/80"
                              >
                                <td className="px-4 py-3 text-slate-900">
                                  {fullName}
                                </td>
                                <td className="px-4 py-3 text-slate-700">
                                  {u.email}
                                </td>
                                <td className="px-4 py-3 text-slate-700">
                                  {u.roles.join(", ")}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    {u.isDisabled ? (
                                      <button
                                        type="button"
                                        onClick={() => openUserAction("enable", u)}
                                        className="rounded-full border border-emerald-500 text-emerald-700 text-xs md:text-sm font-semibold px-3 py-1.5 hover:bg-emerald-50 transition"
                                      >
                                        Enable
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => openUserAction("disable", u)}
                                        className="rounded-full border border-red-500 text-red-700 text-xs md:text-sm font-semibold px-3 py-1.5 hover:bg-red-50 transition"
                                      >
                                        Disable
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {pageInfo && (
                      <div className="flex items-center justify-between mt-4 text-xs text-slate-600">
                        <div>
                          Page {pageInfo.number + 1} of {pageInfo.totalPages} ·{" "}
                          {pageInfo.totalElements} users
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={!canGoPrev}
                            onClick={() =>
                              canGoPrev && setCurrentPage((p) => p - 1)
                            }
                            className="rounded-full border border-slate-200 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 hover:bg-slate-50 transition"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            disabled={!canGoNext}
                            onClick={() =>
                              canGoNext && setCurrentPage((p) => p + 1)
                            }
                            className="rounded-full border border-slate-200 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 hover:bg-slate-50 transition"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ACCOUNT CONFIRM MODAL */}
      {showConfirmAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Confirm account update
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              You&apos;re about to update your admin account details. Please
              confirm the changes.
            </p>

            <ul className="text-sm text-slate-700 space-y-1 mb-4">
              {form.email && form.email !== user.email && (
                <li>
                  <span className="font-semibold">Email:</span> {user.email} →{" "}
                  {form.email}
                </li>
              )}
              {form.firstName.trim() &&
                form.firstName.trim() !== (user.firstName ?? "").trim() && (
                  <li>
                    <span className="font-semibold">First name:</span>{" "}
                    {form.firstName}
                  </li>
                )}
              {form.lastName.trim() &&
                form.lastName.trim() !== (user.lastName ?? "").trim() && (
                  <li>
                    <span className="font-semibold">Last name:</span>{" "}
                    {form.lastName}
                  </li>
                )}
              {form.password && (
                <li>
                  <span className="font-semibold">Password:</span> will be
                  updated
                </li>
              )}
              {!(
                (form.email && form.email !== user.email) ||
                (form.firstName.trim() &&
                  form.firstName.trim() !== (user.firstName ?? "").trim()) ||
                (form.lastName.trim() &&
                  form.lastName.trim() !== (user.lastName ?? "").trim()) ||
                form.password
              ) && (
                  <li className="text-slate-500">
                    You haven&apos;t changed any fields yet.
                  </li>
                )}
            </ul>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowConfirmAccount(false)}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                disabled={accountSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccountUpdate}
                disabled={accountSubmitting}
                className="rounded-full bg-amber-700 px-5 py-1.5 text-sm font-semibold text-white shadow-md hover:bg-amber-600 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {accountSubmitting ? "Updating..." : "Confirm update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER ENABLE/DISABLE MODAL */}
      {userAction?.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {userAction.mode === "disable"
                ? "Disable user"
                : "Enable user"}
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              {userAction.mode === "disable"
                ? "This will disable the user’s access to Digilib. You can enable the account again later."
                : "This will re-enable the user’s access to Digilib."}
            </p>

            <p className="text-sm text-slate-800 mb-4">
              <span className="font-semibold">User:</span>{" "}
              {userAction.user.email}
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setUserAction(null)}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                disabled={userActionSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUserAction}
                disabled={userActionSubmitting}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold text-white shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition ${userAction.mode === "disable"
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-emerald-600 hover:bg-emerald-500"
                  }`}
              >
                {userActionSubmitting
                  ? "Applying..."
                  : userAction.mode === "disable"
                    ? "Disable user"
                    : "Enable user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default AdminDashboardPage;
