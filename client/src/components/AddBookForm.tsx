import { Autocomplete, Button, Skeleton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import {
  addBookQuery,
  baseURL,
  DefaultBookGenresResponse,
  fetcher,
} from "../utils/queries";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import moment from "moment";
import useSWR, { Key } from "swr";
import useSWRMutation from "swr/mutation";
import { useRecoilState } from "recoil";
import { previouslyAddedBooksState } from "../store/store";
import { produce } from "immer";
import { TBookData } from "../utils/types";

const TextFieldWithStyle = styled(TextField)`
  display: flex;
  width: 300px;
  height: 56px;
  margin: 10px 0;
`;

export function AddBookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TBookData>();
  const [shouldAddBook, setShouldAddBook] = useState(false);
  const [dataToAdd, setDataToAdd] = useState<TBookData | undefined>();
  const [previouslyAddedBooks, setPreviouslyAddedBooks] = useRecoilState(
    previouslyAddedBooksState
  );

  const {
    data: genresData,
    error: genresError,
    isLoading: areGenresLoading,
  } = useSWR<DefaultBookGenresResponse, Error>(
    baseURL + "/get-books-genres",
    fetcher
  );
  const {
    error: addBookError,
    trigger: triggerAddBook,
    isMutating: isAddingBook,
  } = useSWRMutation<any, Error, Key, TBookData>(
    baseURL + "/add-book",
    addBookQuery
  );

  const [booksGenres, setBookGenres] = useState<string[] | undefined>();
  const [genresErrorMessage, setGenresErrorMessage] = useState("");

  function validateDate(fieldValue: string): boolean {
    return moment(fieldValue, "DD-MM-y", true).isValid();
  }

  async function processFormData(data: TBookData) {
    await triggerAddBook(data);
    setPreviouslyAddedBooks(
      produce(previouslyAddedBooks, (nextState) => {
        nextState.push(data);
      })
    );
  }

  useEffect(() => {
    if (genresError) {
      setGenresErrorMessage(genresError.message);
      return;
    }
    if (!areGenresLoading) {
      setBookGenres(genresData?.genres);
    }
  }, [areGenresLoading]);

  return (
    <>
      <h1>Add new book to database</h1>
      <span
        style={{
          display: errors.publication_date ? "flow" : "none",
          position: "absolute",
          top: 135 + 56 * 6 + 14,
          left: 330,
          color: "red",
        }}
      >
        &lt;== Not a date
      </span>
      <form onSubmit={handleSubmit(processFormData)}>
        <TextFieldWithStyle
          {...register("title", { required: true })}
          label="Book title"
        />
        {booksGenres ? (
          <Autocomplete
            options={booksGenres}
            renderInput={(params) => (
              <TextField
                {...params}
                {...register("genre")}
                label="Book genre"
              />
            )}
            sx={{ width: 300, height: 56, margin: "5px 0" }}
          />
        ) : genresError ? (
          <p>{genresErrorMessage}</p>
        ) : (
          <Skeleton variant="rectangular" sx={{ width: 300, height: 56 }} />
        )}
        <TextFieldWithStyle {...register("author")} label="Book author" />
        <TextFieldWithStyle {...register("isbn")} label="Book ISBN" />
        <TextFieldWithStyle {...register("publisher")} label="Book publisher" />
        <TextFieldWithStyle
          {...register("publication_date", { validate: validateDate })}
          label="Book publication date (dd-mm-yyyy)"
        />
        <TextFieldWithStyle {...register("language")} label="Book language" />
        {!isAddingBook ? (
          <Button
            type="submit"
            variant="contained"
            style={{ width: "300px", height: "56px", margin: "5px 0" }}
          >
            Add New Book
          </Button>
        ) : (
          <Skeleton sx={{ width: 300, height: 56, margin: "5px 0" }} />
        )}
        {addBookError ? (
          <p style={{ color: "red" }}>
            Error while adding book: {addBookError.message}
          </p>
        ) : (
          <></>
        )}
      </form>
    </>
  );
}
