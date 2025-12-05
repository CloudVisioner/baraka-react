import React, { useEffect } from "react";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import Advertisement from "./Advertisement";
import AcitveUsers from "./AcitveUsers";
import Events from "./Events";
import Statistics from "./Statistic";
import "../../../css/home.css"


export default function HomePage() {

  useEffect(() => {

  }, [])
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
