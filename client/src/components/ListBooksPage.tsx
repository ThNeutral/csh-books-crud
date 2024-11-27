import { useRecoilState, useRecoilValue } from "recoil";
import {
  previouslyAddedBooksSelector,
  previouslyAddedBooksState,
} from "../store/store";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { TBookData } from "../utils/types";
import { useEffect, useRef, useState } from "react";
import useSWR, { Key, mutate } from "swr";
import { baseURL, deleteBookQuery, fetcher } from "../utils/queries";
import { Delete, ModeEdit } from "@mui/icons-material";
import useSWRMutation from "swr/mutation";

export function ListBooksPage() {
  const previouslyAddedBooksColumns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 150,
    },
    {
      field: "genre",
      headerName: "Genre",
      width: 150,
    },
    {
      field: "author",
      headerName: "Author",
      width: 150,
    },
    {
      field: "isbn",
      headerName: "ISBN",
      width: 150,
    },
    {
      field: "publisher",
      headerName: "Publisher",
      width: 150,
    },
    {
      field: "publishing_date",
      headerName: "Publishing Date",
      width: 150,
    },
    {
      field: "language",
      headerName: "Language",
      width: 150,
    },
  ];

  const allColumns = structuredClone(previouslyAddedBooksColumns);
  allColumns.push({
    field: "action",
    type: "actions",
    width: 100,
    headerName: "Actions",
    getActions(params) {
      return [
        <GridActionsCellItem
          icon={<ModeEdit />}
          onClick={() => handleDeleteBook(params)}
          label="Save"
        />,
        <GridActionsCellItem
          icon={<Delete />}
          onClick={() => handleDeleteBook(params)}
          label="Delete"
        />,
      ];
    },
  });

  const [previouslyAddedBooks, setPreviouslyAddedBooks] = useRecoilState(
    previouslyAddedBooksState
  );
  const [previouslyAddedBooksWithId, setPreviouslyAddedBooksWithId] = useState<
    (TBookData & { id: number })[]
  >([]);
  const [allBooksWithId, setAllBooksWithId] = useState<
    (TBookData & { id: number })[]
  >([]);

  const [refetchKey, setRefetchKey] = useState(Date.now());
  const {
    data: allBooksData,
    error: allBooksError,
    mutate: mutateAllBooks,
    isLoading: areAllBooksLoading,
  } = useSWR<TBookData[]>([baseURL + "/get-books", refetchKey], ([url]) =>
    fetcher(url)
  );

  const {
    error: deleteBookError,
    trigger: triggerDeleteBook,
    isMutating: isDeletingBook,
  } = useSWRMutation<any, Error, Key, { id: string }>(
    baseURL + "/delete-book",
    deleteBookQuery
  );

  async function handleEditBook(data: GridRowParams) {}

  async function handleDeleteBook(data: GridRowParams) {
    await triggerDeleteBook({ id: data.id as string });
    setAllBooksWithId(allBooksWithId.filter((book) => book.id != data.id));
    setPreviouslyAddedBooks(
      previouslyAddedBooks.filter((book) => book.id != data.id)
    );
  }

  useEffect(() => {
    setPreviouslyAddedBooksWithId(
      previouslyAddedBooks.map((book, index) => {
        return {
          ...book,
        };
      })
    );
  }, [previouslyAddedBooks.length]);

  useEffect(() => {
    if (allBooksData) {
      setAllBooksWithId(
        allBooksData.map((book, index) => {
          return {
            ...book,
            publication_date: book.publication_date
              .split("T")[0]
              .split("-")
              .reverse()
              .join("-"),
          };
        })
      );
    }
  }, [areAllBooksLoading]);

  return (
    <>
      <h3>Books that you have just added</h3>
      <DataGrid
        columns={allColumns}
        rows={previouslyAddedBooksWithId}
        sx={{ width: 7 * 150 + 100 + 10 }}
        hideFooter
        slots={{ toolbar: GridToolbar }}
      ></DataGrid>
      <h3>All Books</h3>
      <DataGrid
        columns={allColumns}
        loading={areAllBooksLoading}
        rows={allBooksWithId}
        sx={{ width: 7 * 150 + 100 + 10 }}
        hideFooter
        slots={{ toolbar: GridToolbar }}
      ></DataGrid>
    </>
  );
}
