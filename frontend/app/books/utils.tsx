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


export type SortOption = "title" | "isbn" | "publicationDate";


export interface LibraryBookData {
  id: number;
  barcode: string;
  status: "AVAILABLE" | "RESERVED" | "CHECKED_OUT" | string;
  libraryId: number;
  libraryName: string;
  libraryAddress: string;
}
