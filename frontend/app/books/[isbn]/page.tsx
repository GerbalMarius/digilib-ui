// app/books/[isbn]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import Spinner from "../../ui/Spinner";
import { axiosClient } from "../../lib/axios-client";
import { useAuth } from "../../lib/auth-context";
import type { BookData, LibraryBookData } from "../utils";

const BookDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();

  const isbn =
    typeof params?.isbn === "string"
      ? params.isbn
      : Array.isArray(params?.isbn)
      ? params.isbn[0]
      : undefined;

  const [book, setBook] = useState<BookData | null>(null);
  const [copies, setCopies] = useState<LibraryBookData[]>([]);
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingCopies, setLoadingCopies] = useState(true);
  const [errorBook, setErrorBook] = useState<string | null>(null);
  const [errorCopies, setErrorCopies] = useState<string | null>(null);

  const [reserveError, setReserveError] = useState<string | null>(null);
  const [reserveSuccess, setReserveSuccess] = useState<string | null>(null);
  const [reserveLoadingId, setReserveLoadingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isbn) return;

    let cancelled = false;

    async function fetchBook() {
      try {
        setLoadingBook(true);
        setErrorBook(null);

        const res = await axiosClient.get<BookData>(`/books/${isbn}`);
        if (cancelled) return;

        setBook(res.data);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setErrorBook("Unable to load book details.");
      } finally {
        if (!cancelled) setLoadingBook(false);
      }
    }

    async function fetchCopies() {
      try {
        setLoadingCopies(true);
        setErrorCopies(null);

        const res = await axiosClient.get<LibraryBookData[]>(
          `/books/${isbn}/copies`
        );
        if (cancelled) return;

        setCopies(res.data);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setErrorCopies(
          "Unable to load availability across libraries at the moment."
        );
      } finally {
        if (!cancelled) setLoadingCopies(false);
      }
    }

    fetchBook();
    fetchCopies();

    return () => {
      cancelled = true;
    };
  }, [isbn]);

  const availableCopies = useMemo(
    () => copies.filter((c) => c.status === "AVAILABLE"),
    [copies]
  );

  async function handleReserve(copyId: number) {
    if (!isAuthenticated) {
      setReserveError("You must be logged in to reserve a copy.");
      return;
    }

    try {
      setReserveLoadingId(copyId);
      setReserveError(null);
      setReserveSuccess(null);

      await axiosClient.post(`/books/${copyId}/reserve`);

      const updated = copies.map((c) =>
        c.id === copyId ? { ...c, status: "RESERVED" } : c
      );
      setCopies(updated);
      setReserveSuccess("Reservation placed successfully.");
    } catch (err) {
      console.error(err);
      setReserveError(
        "Unable to reserve this copy. Please try again or contact your library."
      );
    } finally {
      setReserveLoadingId(null);
    }
  }

  if (!isbn) {
    return (
      <main className="bg-amber-50 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-amber-100 rounded-3xl shadow-md px-6 py-6 text-center">
          <p className="text-sm text-red-700 mb-2">
            Invalid book URL. ISBN is missing.
          </p>
          <button
            type="button"
            onClick={() => router.push("/books")}
            className="mt-2 rounded-full bg-amber-700 text-white px-6 py-2 text-sm font-semibold hover:bg-amber-600"
          >
            Back to books
          </button>
        </div>
      </main>
    );
  }

  if (loadingBook && !book) {
    return (
      <main className="bg-amber-50 min-h-screen flex items-center justify-center">
        <Spinner />
      </main>
    );
  }

  if (errorBook || !book) {
    return (
      <main className="bg-amber-50 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-amber-100 rounded-3xl shadow-md px-6 py-6 text-center">
          <p className="text-sm text-red-700 mb-2">
            {errorBook ?? "Book not found."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/books")}
            className="mt-2 rounded-full bg-amber-700 text-white px-6 py-2 text-sm font-semibold hover:bg-amber-600"
          >
            Back to books
          </button>
        </div>
      </main>
    );
  }

  const publicationYear = book.publicationDate
    ? new Date(book.publicationDate).getFullYear()
    : null;

  return (
    <main className="relative min-h-screen bg-linear-to-b from-amber-50 via-amber-50 to-amber-100">
      {/* soft background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute top-40 -right-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <section className="relative container mx-auto px-6 pt-16 pb-20 max-w-7xl">
        {/* back link */}
        <button
          type="button"
          onClick={() => router.push("/books")}
          className="mb-6 inline-flex items-center text-sm font-medium text-amber-800 hover:text-amber-700"
        >
          ← Back to all books
        </button>

        {/* main card */}
        <div
          className="bg-linear-to-br from-white via-amber-50/70 to-white border border-amber-200 
                     rounded-3xl shadow-2xl px-6 md:px-12 py-8 md:py-12 flex flex-col gap-10 md:gap-10 lg:flex-row"
        >
          {/* LEFT: book info */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* cover */}
              <div className="w-full md:w-1/3 flex justify-center">
                <div
                  className="relative h-64 w-44 md:h-72 md:w-52 bg-amber-50 rounded-3xl shadow-inner overflow-hidden 
                             flex items-center justify-center group border border-amber-100"
                >
                  <Image
                    src="/img/book.svg"
                    alt={book.title}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-200"
                    priority
                  />
                </div>
              </div>

              {/* main details */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">
                  {book.title}
                </h1>

                <div className="flex flex-wrap gap-2 text-[11px] md:text-xs uppercase tracking-wide text-slate-500 mb-4">
                  {publicationYear && (
                    <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                      {publicationYear}
                    </span>
                  )}
                  {book.language && (
                    <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                      {book.language}
                    </span>
                  )}
                  {book.edition && (
                    <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                      {book.edition}
                    </span>
                  )}
                  {book.pageCount && (
                    <span className="px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                      {book.pageCount} pages
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full bg-amber-50 border border-amber-200 font-medium text-amber-900">
                    ISBN: {book.isbn}
                  </span>
                </div>

                {book.summary && (
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                    {book.summary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: libraries / reservation */}
          <div className="w-full lg:w-5/12 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Availability
              </h2>
              {!loadingCopies && (
                <span className="text-xs md:text-sm text-slate-500">
                  {availableCopies.length} available copy
                  {availableCopies.length === 1 ? "" : "ies"}
                </span>
              )}
            </div>

            {loadingCopies ? (
              <div className="flex items-center justify-center py-8">
                <Spinner inline />
              </div>
            ) : errorCopies ? (
              <p className="text-sm text-red-700">{errorCopies}</p>
            ) : copies.length === 0 ? (
              <p className="text-sm text-slate-600">
                No copies are registered for this title in connected libraries.
              </p>
            ) : (
              <>
                {/* LOGIN REQUIRED CALL-OUT */}
                {!isAuthenticated && (
                  <div
                    className="mb-3 rounded-2xl border border-amber-300 bg-amber-50/90 px-4 py-3 
                               flex flex-col sm:flex-row gap-3 sm:items-center shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-900">
                        Log in to reserve a copy
                      </p>
                      <p className="text-xs md:text-sm text-amber-800/90">
                        You can see availability below, but reservations require a Digilib
                        account.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/auth")}
                      className="inline-flex items-center justify-center rounded-full bg-amber-800 text-amber-50 
                                 px-4 py-1.5 text-xs md:text-sm font-semibold shadow-sm hover:bg-amber-700"
                    >
                      Go to login
                    </button>
                  </div>
                )}

                {reserveError && (
                  <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                    {reserveError}
                  </div>
                )}
                {reserveSuccess && (
                  <div className="mb-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                    {reserveSuccess}
                  </div>
                )}

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {copies.map((copy) => {
                    const isAvailable = copy.status === "AVAILABLE";
                    const isLoading = reserveLoadingId === copy.id;

                    return (
                      <div
                        key={copy.id}
                        className="group flex items-start justify-between gap-3 rounded-2xl border border-amber-100 
                                   bg-amber-50/70 px-4 py-3 hover:bg-amber-50 hover:border-amber-200 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-slate-900">
                            {copy.libraryName}
                          </div>
                          <div className="text-xs text-slate-600">
                            {copy.libraryAddress}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="px-1.5 py-0.5 rounded-full bg-white/90 border border-amber-100">
                              Barcode: {copy.barcode}
                            </span>
                            <StatusBadge status={copy.status} />
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={
                            !isAuthenticated || !isAvailable || isLoading
                          }
                          onClick={() => handleReserve(copy.id)}
                          className={`mt-1 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm 
                          transition-transform ${
                            isAvailable
                              ? "bg-amber-700 text-white hover:bg-amber-600 hover:-translate-y-0.5"
                              : "bg-slate-200 text-slate-500 cursor-not-allowed"
                          } ${
                            (!isAuthenticated || !isAvailable) &&
                            "opacity-70 cursor-not-allowed"
                          }`}
                        >
                          {isLoading ? "Reserving..." : "Reserve"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {availableCopies.length === 0 && (
                  <p className="mt-3 text-xs md:text-sm text-slate-500">
                    All copies are currently borrowed or reserved. Check back
                    later or contact your library directly.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookDetailPage;

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status.toUpperCase();
  let bg = "bg-slate-100";
  let text = "text-slate-800";

  if (normalized === "AVAILABLE") {
    bg = "bg-emerald-50";
    text = "text-emerald-800";
  } else if (normalized === "BORROWED") {
    bg = "bg-amber-50";
    text = "text-amber-800";
  } else if (normalized === "RESERVED") {
    bg = "bg-sky-50";
    text = "text-sky-800";
  }

  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${bg} ${text}`}
    >
      {normalized.charAt(0) + normalized.slice(1).toLowerCase()}
    </span>
  );
};
