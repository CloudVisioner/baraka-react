import React from "react";
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

// Define a default theme
// index.tsx is a connecter between App.tsx and root

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>, // passing <App /> componet to root, an empty HTML. Created in jsReact
  document.getElementById("root") // React put the HTML from your App.tsx inside it.
  // Style comes from css files.
);

reportWebVitals();

// HTML ->Gives structure (<div>) =	index.html
// CSS ->	Adds design (color, layout)	= app.css, index.css
// JS -> (React)	Builds the content dynamically = index.tsx, App.tsx
