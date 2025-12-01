"use client";

import { useEffect, useMemo, useState } from "react";
import Spinner from "../ui/Spinner";
import { axiosClient } from "../lib/axios-client";
import type { PageResponse } from "../lib/page-utils";
import BookCard from "./BookCard";
import { BookData, SortOption } from "./utils";


const sortOptionToParam: Record<SortOption, string[]> = {
    title: ["title"],
    isbn: ["isbn"],
    publicationDate: ["publicationDate"],
};

const BooksPage = () => {
    const [books, setBooks] = useState<BookData[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sortOption, setSortOption] = useState<SortOption>("title");
    const [search, setSearch] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchBooks() {
            try {
                setLoading(true);
                setError(null);

                const sorts = sortOptionToParam[sortOption];

                const res = await axiosClient.get<PageResponse<BookData>>("/books", {
                    params: { page, sorts },
                });

                if (cancelled) return;

                setBooks(res.data.content);
                setTotalPages(res.data.page.totalPages);
                setTotalElements(res.data.page.totalElements);
            } catch (err) {
                if (cancelled) return;
                setError("Unable to load books. Please try again later.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchBooks();
        return () => {
            cancelled = true;
        };
    }, [page, sortOption]);

    const filteredBooks = useMemo(() => {
        if (!search.trim()) return books;
        const q = search.toLowerCase();
        return books.filter(
            (b) =>
                b.title.toLowerCase().includes(q) ||
                b.summary.toLowerCase().includes(q) ||
                b.isbn.toLowerCase().includes(q)
        );
    }, [books, search]);

    const pageNumbers = useMemo(() => {
        const maxButtons = 7;
        if (totalPages <= maxButtons) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: number[] = [];
        const left = Math.max(2, page - 2);
        const right = Math.min(totalPages - 1, page + 2);
        pages.push(1);
        if (left > 2) pages.push(-1);
        for (let p = left; p <= right; p++) pages.push(p);
        if (right < totalPages - 1) pages.push(-2);
        pages.push(totalPages);
        return pages;
    }, [page, totalPages]);

    return (
        <main className="relative min-h-screen bg-linear-to-b from-amber-50 via-amber-50 to-amber-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
                <div className="absolute top-40 -right-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
                <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
            </div>

            <section className="relative container mx-auto px-6 pt-16 pb-20">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Browse books
                    </h1>
                    <p className="text-slate-700 max-w-2xl mx-auto mb-6">
                        Explore titles from all connected libraries. Use search and sorting
                        to quickly find your next read.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 items-stretch sm:items-center">
                        <input
                            type="text"
                            placeholder="Search by title, summary, or ISBN..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full sm:w-80 md:w-96 rounded-full border border-amber-200 bg-white/90 px-4 py-2.5 text-sm md:text-base 
              text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                        />
                        <select
                            value={sortOption}
                            onChange={(e) => {
                                setSortOption(e.target.value as SortOption);
                                setPage(1);
                            }}
                            className="rounded-full border border-amber-200 bg-white/90 px-4 py-2.5 text-sm md:text-base 
              text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                        >
                            <option value="title">Sort by title</option>
                            <option value="isbn">Sort by ISBN</option>
                            <option value="publicationDate">Sort by publication date</option>
                        </select>
                    </div>
                </header>

                {/* RESULTS CONTAINER (card) */}
                <div className="relative rounded-3xl bg-white/90 border border-amber-100 shadow-lg px-4 md:px-6 py-6 md:py-8">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[260px]">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
                            {error}
                        </div>
                    ) : filteredBooks.length === 0 ? (
                        <div className="text-center text-slate-600 py-10">
                            No books found. Try adjusting your search or sorting.
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {filteredBooks.map((book) => (
                                    <BookCard key={book.isbn} book={book} />
                                ))}
                            </div>

                            {/* PAGINATION */}
                            <div className="mt-10 flex flex-col items-center gap-4">
                                <p className="text-sm text-slate-600 text-center">
                                    Showing{" "}
                                    <span className="font-semibold">{filteredBooks.length}</span> of{" "}
                                    <span className="font-semibold">{totalElements}</span> books • Page{" "}
                                    <span className="font-semibold">{page}</span> of{" "}
                                    <span className="font-semibold">{totalPages}</span>
                                </p>

                                <div className="flex items-center gap-2 md:gap-3">
                                    {/* Previous */}
                                    <button
                                        type="button"
                                        disabled={page <= 1}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-amber-300 
                                             text-amber-800 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed 
                                                    transition shadow-sm"
                                    >
                                        Previous
                                    </button>

                                    {/* Page numbers */}
                                    <div className="flex items-center gap-1 md:gap-2">
                                        {pageNumbers.map((p, idx) =>
                                            p < 0 ? (
                                                <span
                                                    key={`ellipsis-${idx}`}
                                                    className="px-2 text-lg text-slate-500 select-none"
                                                >
                                                    …
                                                </span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition 
                                                            ${p === page
                                                            ? "bg-amber-700 text-white shadow-md scale-105"
                                                            : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-100"
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    {/* Next */}
                                    <button
                                        type="button"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                        className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-amber-300 
                                                 text-amber-800 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed 
                                                  transition shadow-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BooksPage;
