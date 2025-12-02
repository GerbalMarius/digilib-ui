export interface BookData {
    isbn: string;
    title: string;
    summary: string;
    imageUrl: string;
    pageCount: number | null;
    publicationDate: string | null;
    language: string;
    edition: string;
}

export interface ReservationData {
  id: number;
  barcode: string;
  book: BookData;
}


export type SortOption = "title" | "isbn" | "publicationDate";


export interface LibraryBookData {
  id: number;
  barcode: string;
  status: "AVAILABLE" | "RESERVED" | "CHECKED_OUT" | string;
  libraryId: number;
  libraryName: string;
  libraryAddress: string;
}

export type Scope = "all" | "genre" | "genreAuthor";

export interface GenreData {
  id: number;
  title: string;
};

export interface AuthorData {
  id: number;
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  deathDate?: string | null;
};

