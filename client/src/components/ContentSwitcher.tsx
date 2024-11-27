import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { addBookPath, allPaths } from "../utils/paths";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export function ContentSwitcher() {
  const navigate = useNavigate();

  const [endpoint, setEndpoint] = useState(window.location.pathname);

  useEffect(() => {
    if (window.location.pathname == "/" || window.location.pathname == "")
      navigate(addBookPath);
  }, [window.location.pathname]);

  function handleNavigate(_: any, newPath: string) {
    navigate(newPath);
    setEndpoint(newPath);
  }

  return (
    <>
      <ToggleButtonGroup value={endpoint} onChange={handleNavigate} exclusive>
        {allPaths.map((path) => {
          return (
            <ToggleButton key={path.path} value={path.path}>
              {path.name}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <br />
      <Outlet />
    </>
  );
}
