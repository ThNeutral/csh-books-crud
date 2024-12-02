import { useRecoilState, useRecoilValue } from "recoil";
import {
  previouslyAddedBooksSelector,
  previouslyAddedBooksState,
} from "../store/store";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridSaveAltIcon,
  GridToolbar,
  MuiBaseEvent,
  MuiEvent,
} from "@mui/x-data-grid";
import { TBookData } from "../utils/types";
import { useEffect, useRef, useState } from "react";
import useSWR, { Key, mutate } from "swr";
import {
  baseURL,
  DefaultBookGenresResponse,
  deleteBookQuery,
  fetcher,
  updateBookQuery,
} from "../utils/queries";
import { Cancel, Delete, ModeEdit, Save } from "@mui/icons-material";
import useSWRMutation from "swr/mutation";
import { TextField } from "@mui/material";

export function ListBooksPage() {
  const [previouslyAddedBooks, setPreviouslyAddedBooks] = useRecoilState(
    previouslyAddedBooksState
  );
  const [allBooks, setAllBooks] = useState<(TBookData & { id: number })[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { data: allBooksData, isLoading: areAllBooksLoading } = useSWR<
    TBookData[]
  >([baseURL + "/get-books"], ([url]) => fetcher(url));
  const { data: genresData } = useSWR<DefaultBookGenresResponse, Error>(
    baseURL + "/get-books-genres",
    fetcher
  );
  const { trigger: triggerDeleteBook } = useSWRMutation(
    baseURL + "/delete-book",
    deleteBookQuery
  );
  const { trigger: triggerUpdateBook } = useSWRMutation(
    baseURL + "/update-book",
    updateBookQuery
  );

  function handleEditBook(params: GridRowParams) {
    setRowModesModel({
      ...rowModesModel,
      [params.id]: { mode: GridRowModes.Edit },
    });
  }

  function handleSaveBook(params: GridRowParams) {
    setRowModesModel({
      ...rowModesModel,
      [params.id]: { mode: GridRowModes.View },
    });
  }

  function handleCancelEditBook(params: GridRowParams) {
    setRowModesModel({
      ...rowModesModel,
      [params.id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  }

  async function handleDeleteBook(params: GridRowParams) {
    await triggerDeleteBook({ id: params.id as string });
    setAllBooks(allBooks.filter((book) => book.id != params.id));
    setPreviouslyAddedBooks(
      previouslyAddedBooks.filter((book) => book.id != params.id)
    );
  }

  function handleRowModesModelChange(newRowModesModel: GridRowModesModel) {
    setRowModesModel(newRowModesModel);
  }

  function handleRowEditStop(
    params: GridRowEditStopParams,
    event: MuiEvent<MuiBaseEvent>
  ) {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }

  async function processRowUpdate(newRow: any) {
    await triggerUpdateBook(newRow);
    const updatedRow = { ...newRow, isNew: false };
    setAllBooks(
      allBooks.map((book) => (book.id === newRow.id ? updatedRow : book))
    );
    return updatedRow;
  }

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 150,
      editable: true,
    },
    {
      field: "genre",
      headerName: "Genre",
      width: 150,
      type: "singleSelect",
      valueOptions: genresData ? genresData.genres : [],
      editable: true,
    },
    {
      field: "author",
      headerName: "Author",
      width: 150,
      editable: true,
    },
    {
      field: "isbn",
      headerName: "ISBN",
      width: 150,
      editable: true,
    },
    {
      field: "publisher",
      headerName: "Publisher",
      width: 150,
      editable: true,
    },
    {
      field: "publication_date",
      headerName: "Publication Date",
      width: 200,
      editable: true,
    },
    {
      field: "language",
      headerName: "Language",
      width: 150,
      editable: true,
    },
    {
      field: "action",
      type: "actions",
      width: 100,
      headerName: "Actions",
      getActions(params) {
        const isInEditMode =
          rowModesModel[params.id]?.mode == GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              onClick={() => handleSaveBook(params)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              onClick={() => handleCancelEditBook(params)}
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<ModeEdit />}
            onClick={() => handleEditBook(params)}
            label="Edit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            onClick={() => handleDeleteBook(params)}
            label="Delete"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    if (allBooksData) {
      setAllBooks(
        allBooksData.map((book) => {
          return {
            ...book,
            publication_date: book.publication_date
              .split("T")[0]
              .split("-")
              .reverse()
              .join("-"),
          } as any;
        })
      );
    }
  }, [areAllBooksLoading]);

  return (
    <>
      {/* <h3>Books that you have just added</h3>
      <DataGrid
        columns={columns}
        rows={previouslyAddedBooks}
        sx={{ width: 7 * 150 + 100 + 10 }}
        hideFooter
        slots={{ toolbar: GridToolbar }}
      ></DataGrid>
      <h3>All Books</h3> */}
      <DataGrid
        columns={columns}
        loading={areAllBooksLoading}
        rows={allBooks}
        rowModesModel={rowModesModel}
        sx={{ width: 7 * 150 + 100 + 10 + 50 }}
        hideFooter
        editMode="row"
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        onRowEditStop={handleRowEditStop}
        slots={{ toolbar: GridToolbar }}
      />
    </>
  );
}
