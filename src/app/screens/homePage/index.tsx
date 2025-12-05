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
  (popularDishes) => ({ popularDishes })
);

export default function HomePage() {
  const dispatch = useDispatch();
  const { setPopularDishes } = actionDispatch(dispatch);

  const { popularDishes } = useSelector(popularDishesRetriever);

  useEffect(() => {
    // Backend server data request => Data
    const result = [
      {
        _id: "690a18227de83329dec4ec07",
        productStatus: "PROCESS",
        productCollection: "DISH",
        productName: "Steak",
        productPrice: 15,
        productLeftCount: 199,
        productSize: "NORMAL",
        productVolume: 1,
        productDesc: "This is the most delicious Steak",
        productImages: [
          // image URLs
        ],
        productViews: 0,
        createdAt: "2025-11-04T15:13:38.078+00:00",
        updatedAt: "2025-11-05T02:57:02.550+00:00",
        __v: 0,
      },
    ];

    // Slice: Data => Store
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
