import React, { useEffect } from "react";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import Advertisement from "./Advertisement";
import AcitveUsers from "./AcitveUsers";
import Events from "./Events";
import Statistics from "./Statistic";
import "../../../css/home.css";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setPopularDishes } from "./slice";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
});

const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes }) // just selcted data name
);

export default function HomePage() {
  const { setPopularDishes } = actionDispatch(useDispatch()); // Real React Hook
  const { popularDishes } = useSelector(popularDishesRetriever);

  console.log(process.env.REACT_APP_API_URL)

  useEffect(() => {
    // Backend server data request => Data
    const result = [{}];
    // Slice: Data => Store
    console.log("REDUX IS RUNNING");
    // @ts-ignore
    setPopularDishes(result);
  }, []);

  console.log("popularDishes", popularDishes);
  return (
    <div className={"homepage"}>
      <Statistics />
      <PopularDishes />
      <NewDishes />
      <Advertisement />
      <AcitveUsers />
      <Events />
    </div>
  );
}
