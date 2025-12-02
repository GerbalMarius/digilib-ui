"use client";

import { useEffect, useMemo, useState } from "react";
import Spinner from "../ui/Spinner";
import { axiosClient } from "../lib/axios-client";
import type { PageResponse } from "../lib/page-utils";
import BookCard from "./BookCard";
import { AuthorData, BookData, GenreData, Scope, SortOption } from "./utils";
import NavBar from "../ui/NavBar";

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

  const [scope, setScope] = useState<Scope>("all");

  const [genres, setGenres] = useState<GenreData[]>([]);
  const [genresLoading, setGenresLoading] = useState(false);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  const [authors, setAuthors] = useState<AuthorData[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);


  useEffect(() => {
    if (scope === "all" || genres.length > 0) return;

    let cancelled = false;

    async function fetchGenres() {
      try {
        setGenresLoading(true);
        const res = await axiosClient.get<GenreData[]>("/genres");
        if (cancelled) return;
        setGenres(res.data);
      } catch {
        if (!cancelled) {
        }
      } finally {
        if (!cancelled) setGenresLoading(false);
      }
    }

    fetchGenres();
    return () => {
      cancelled = true;
    };
  }, [scope, genres.length]);

  useEffect(() => {
    if (!selectedGenreId) {
      setAuthors([]);
      setSelectedAuthorId(null);
      return;
    }

    let cancelled = false;

    async function fetchAuthors() {
      try {
        setAuthorsLoading(true);
        const res = await axiosClient.get<PageResponse<AuthorData>>(
          `/genres/${selectedGenreId}/authors`,
          {
            params: { page: 1, sorts: ["lastName", "firstName"] },
          }
        );
        if (cancelled) return;
        setAuthors(res.data.content);
      } catch {
        if (!cancelled) setAuthors([]);
      } finally {
        if (!cancelled) setAuthorsLoading(false);
      }
    }

    fetchAuthors();
    return () => {
      cancelled = true;
    };
  }, [selectedGenreId]);

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      if (scope !== "all" && !selectedGenreId) {
        setBooks([]);
        setTotalPages(1);
        setTotalElements(0);
        return;
      }
      if (scope === "genreAuthor" && !selectedAuthorId) {
        setBooks([]);
        setTotalPages(1);
        setTotalElements(0);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const sorts = sortOptionToParam[sortOption];

        let url = "/books";
        if (scope === "genre" && selectedGenreId) {
          url = `/genres/${selectedGenreId}/books`;
        } else if (
          scope === "genreAuthor" &&
          selectedGenreId &&
          selectedAuthorId
        ) {
          url = `/genres/${selectedGenreId}/authors/${selectedAuthorId}/books`;
        }

        const res = await axiosClient.get<PageResponse<BookData>>(url, {
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
  }, [page, sortOption, scope, selectedGenreId, selectedAuthorId]);

  // ------------ derived values ------------

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

  const handleScopeChange = (value: Scope) => {
    setScope(value);
    setPage(1);
    if (value === "all") {
      setSelectedGenreId(null);
      setSelectedAuthorId(null);
    } else if (value === "genre") {
      setSelectedAuthorId(null);
    }
  };

  return (
    <>
    <NavBar
        links={[
          { label: "Home", href: "/" },
          { label: "Browse books", href: "/books" },
          { label: "About", href: "/#about" },
          { label: "How it works", href: "/#how-it-works" },
          { label: "Features", href: "/#features" },
          { label: "Log in", href: "/auth" },
        ]}
        showButton={true}
        buttonHref="/auth"
        orientation="horizontal"
      />

    <main className="relative min-h-screen bg-linear-to-b from-amber-50 via-amber-50 to-amber-100">
      {/* softly glowing background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute top-40 -right-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <section className="relative container mx-auto px-6 pt-16 pb-20">
        {/* HEADER + FILTERS */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Browse books
          </h1>
          <p className="text-slate-700 max-w-2xl mx-auto mb-6">
            Explore titles from all connected libraries, or drill down by genre
            and author to find exactly what you&apos;re looking for.
          </p>

          <div className="flex flex-col gap-3 md:gap-4">
            {/* top row: scope + sort */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 items-stretch sm:items-center">
              <select
                value={scope}
                onChange={(e) => handleScopeChange(e.target.value as Scope)}
                className="rounded-full border border-amber-200 bg-white/90 px-4 py-2.5 text-sm md:text-base 
                  text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
              >
                <option value="all">All books</option>
                <option value="genre">By genre</option>
                <option value="genreAuthor">By genre &amp; author</option>
              </select>

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

            {/* second row: genre / author / search */}
            <div className="flex flex-col lg:flex-row justify-center gap-3 md:gap-4 items-stretch lg:items-center">
              {/* Genre select (only when relevant) */}
              {(scope === "genre" || scope === "genreAuthor") && (
                <select
                  value={selectedGenreId ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedGenreId(val ? Number(val) : null);
                    setSelectedAuthorId(null);
                    setPage(1);
                  }}
                  className="w-full lg:w-60 rounded-full border border-amber-200 bg-white/90 px-4 py-2.5 text-sm md:text-base 
                    text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                >
                  <option value="">
                    {genresLoading ? "Loading genres..." : "Choose genre"}
                  </option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              )}

              {/* Author select when scope === genreAuthor */}
              {scope === "genreAuthor" && (
                <select
                  value={selectedAuthorId ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedAuthorId(val ? Number(val) : null);
                    setPage(1);
                  }}
                  disabled={!selectedGenreId || authorsLoading}
                  className="w-full lg:w-60 rounded-full border border-amber-200 bg-white/90 px-4 py-2.5 text-sm md:text-base 
                    text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                >
                  <option value="">
                    {!selectedGenreId
                      ? "Select a genre first"
                      : authorsLoading
                      ? "Loading authors..."
                      : "Choose author"}
                  </option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.lastName}, {a.firstName}
                    </option>
                  ))}
                </select>
              )}

              {/* Search input */}
              <input
                type="text"
                placeholder="Search within results by title, summary, or ISBN..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full lg:flex-1 rounded-full border border-amber-200 bg-white/90 px-4 py-2.5 text-sm md:text-base 
                  text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
              />
            </div>
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
          ) : (scope === "genre" || scope === "genreAuthor") &&
            !selectedGenreId ? (
            <div className="text-center text-slate-600 py-10">
              Choose a genre to see books in that category.
            </div>
          ) : scope === "genreAuthor" && !selectedAuthorId ? (
            <div className="text-center text-slate-600 py-10">
              Select an author to see their books in the chosen genre.
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center text-slate-600 py-10">
              No books found. Try adjusting your filters or search text.
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
                  <span className="font-semibold">
                    {filteredBooks.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {totalElements}
                  </span>{" "}
                  books • Page{" "}
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
                            ${
                              p === page
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
    </>
  );
};

export default BooksPage;
