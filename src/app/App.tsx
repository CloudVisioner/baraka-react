import React from "react";
import "../css/app.css";

import { Container, Button, Box, Stack, Typography } from "@mui/material";
import { Link, Route, Switch } from "react-router-dom";
import { ProductsPages } from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { HomePage } from "./screens/homePage";
import { UserPage} from "./screens/userPage";

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">HomePage</Link>
          </li>
          <li>
            <Link to="/products">ProductsPage</Link>
          </li>
          <li>
            <Link to="/orders">OrdersPage</Link>
          </li>
          <li>
            <Link to="/member-page">UserPage</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/product">
          <ProductsPages />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/member-page">
          <UserPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </div>
  );

  function Home() {
    return <Container>Home</Container>;
  }
}

export default App;
