import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AddBookForm } from "./components/AddBookForm";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ContentSwitcher } from "./components/ContentSwitcher";
import { addBookPath, listBooksPath } from "./utils/paths";
import { RecoilRoot } from "recoil";
import { ListBooksPage } from "./components/ListBooksPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ContentSwitcher />,
    children: [
      {
        path: addBookPath,
        element: <AddBookForm />,
      },
      {
        path: listBooksPath,
        element: <ListBooksPage />
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </StrictMode>
);
