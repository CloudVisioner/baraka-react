import React, { useEffect } from "react";
import BookCollections from "./BookCollections";
import Advertisement from "./Advertisement";
import AcitveUsers from "./AcitveUsers";
import Events from "./Events";
import Statistics from "./Statistic";
import "../../../css/home.css";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewDishes, setPopularDishes, setFeaturedDishes, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { Member } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  // reducer ga beryapmiz
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
  setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
  setFeaturedDishes: (data: Product[]) => dispatch(setFeaturedDishes(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export default function HomePage() {
  const { setPopularDishes, setNewDishes, setFeaturedDishes, setTopUsers } = actionDispatch(
    useDispatch()
  );

  useEffect(() => {
    // backend server data fetch => Data
    const product = new ProductService();
    
    // Popular dishes (most views - descending)
    product
      .getProducts({
        page: 1,
        limit: 8,
        order: "productViews",
      })
      .then((data) => {
        setPopularDishes(data);
      })
      .catch((err) => console.log(err));

    // New dishes (most recent)
    product
      .getProducts({
        page: 1,
        limit: 8,
        order: "createdAt",
      })
      .then((data) => setNewDishes(data))
      .catch((err) => console.log(err));

    // Featured dishes (less popular - lowest views)
    // Get products sorted by views and reverse to get least popular first
    product
      .getProducts({
        page: 1,
        limit: 100, // Get more to filter
        order: "productViews",
      })
      .then((data) => {
        // Reverse to get least popular (lowest views first), then take first 8
        const lessPopular = [...data].reverse().slice(0, 8);
        setFeaturedDishes(lessPopular);
      })
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={"homepage"}>
      <Statistics />
      <BookCollections />
      <Advertisement />
      <AcitveUsers />
      <Events />
    </div>
  );
}
