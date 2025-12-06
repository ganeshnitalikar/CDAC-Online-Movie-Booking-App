import { useTheme } from "./hooks/useTheme";
import { Button, Switch, Typography } from "@mui/material";
import React from "react";

const App = () => {
  const { toggleMode } = useTheme();
  return (
    <div className="flex justify-center items-center">
      <Switch onClick={toggleMode}>Toggle Theme</Switch>
    </div>
  );
};

export default App;
