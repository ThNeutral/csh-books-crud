const bookData =  {
  genre: "",
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  publication_date: "",
  language: ""
}

export type TBookData = typeof bookData;
export const bookDataKeys = Object.keys(bookData) as (keyof typeof bookData)[]
