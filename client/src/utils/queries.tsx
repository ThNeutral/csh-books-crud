import { TBookData } from "./types";


export const baseURL = "http://localhost:3000";

export async function sleep(ms: number) {
  await new Promise((res) => setTimeout(res, ms));
}

export interface DefaultBookGenresResponse {
  genres: string[];
}

export async function fetcher(...args) {
  const response = await fetch(...args);
  return await response.json();
}

export async function addBookQuery(
  url: string,
  { arg }: { arg: TBookData }
) {
  return await fetcher(url, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: {
      "Content-Type": "application/json"
    }
  } as RequestInit);
}

export async function deleteBookQuery(
  url: string,
  { arg }: { arg: {id: string} }
) {
  await fetch(url, {
    method: "DELETE",
    body: JSON.stringify(arg),
    headers: {
      "Content-Type": "application/json"
    }
  } as RequestInit);
}
