import { atom, selector } from "recoil";
import { TBookData } from "../utils/types";

export const previouslyAddedBooksState = atom<(TBookData & {id: string})[]>({
  key: "previouslyAddedBooks",
  default: [],
});

export const previouslyAddedBooksSelector = selector({
  key: "previouslyAddedBooksSelector",
  get: ({ get }) => {
    const state = get(previouslyAddedBooksState);
    return state;
  },
});
