import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./app/MaterialTheme"; //
import "./css/index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "@mui/material";
import ContextProvider from "./app/context/ContextProvider";

// Define a default theme
// index.tsx is a connector between App.tsx and root

const container = document.getElementById("root")!;
const root = createRoot(container);

// Global Integration
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <App />
          </Router>
        </ThemeProvider>
      </ContextProvider>
    </Provider>
  </React.StrictMode> // passing <App /> componet to root, an empty HTML. Created in jsReact
  // Style comes from css files.
);

reportWebVitals();

// HTML ->Gives structure (<div>) =	index.html
// CSS ->	Adds design (color, layout)	= app.css, index.css
// JS -> (React)	Builds the content dynamically = index.tsx, App.tsx
