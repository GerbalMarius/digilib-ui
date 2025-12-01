// app/books/BookCard.tsx
import { BookData } from "./page";
import Image from "next/image";

const BookCard = ({ book }: { book: BookData }) => {
  const publicationYear = book.publicationDate
    ? new Date(book.publicationDate).getFullYear()
    : null;

  return (
    <div
      className="group bg-white border border-amber-200 rounded-2xl shadow-sm 
      hover:shadow-xl hover:border-amber-300 
      transition-transform duration-200 ease-out hover:-translate-y-1 
      overflow-hidden flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-amber-50/80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-radial-at-t from-amber-200/40 via-transparent to-transparent transition-opacity duration-300" />
        <Image
          src="/img/book.svg"
          alt={book.title}
          fill
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-200"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex flex-col flex-1">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-1 line-clamp-2">
          {book.title}
        </h2>

        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-slate-500 mb-2">
          {publicationYear && <span>{publicationYear}</span>}
          {book.language && <span>{book.language}</span>}
          {book.edition && <span>{book.edition}</span>}
        </div>

        {book.summary && (
          <p className="text-sm text-slate-600 line-clamp-3 mb-3">
            {book.summary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
          <span className="px-2 py-1 rounded-full bg-amber-50 border border-amber-100 font-medium">
            ISBN: {book.isbn}
          </span>
          {book.pageCount && <span>{book.pageCount} pages</span>}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
