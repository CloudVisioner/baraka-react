import { Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";
import ChosenProduct from "./ChosenProduct";
import Products from "./Products";
import "../../../css/products.css";
import { CartItem } from "../../../lib/types/search";

interface ProductPageProps {
  onAdd: (item: CartItem) => void;
}

export default function ProductsPages(props: ProductPageProps) {
  const { onAdd } = props;
  const products = useRouteMatch();
  return (
    <div className={"products-page"}>
      <Switch>
        <Route path={`${products.path}/:productId`}>
          <ChosenProduct onAdd={onAdd} />
        </Route>
        <Route path={`${products.path}`}>
          <Products onAdd={onAdd} />
        </Route>
      </Switch>
    </div>
  );
}
