import {createSelector} from "reselect";
import { ApprootState } from "../../../lib/types/screen";
import { stat } from "fs";

const selectHomePage = (state: ApprootState) => state.homePage;
export const retrievePopularDishes = createSelector(
    selectHomePage,
    (HomePage) => HomePage.popularDishes
)

export const retrieveNewarDishes = createSelector(
    selectHomePage,
    (HomePage) => HomePage.newDishes
)

export const retrieveTopUsers = createSelector(
    selectHomePage,
    (HomePage) => HomePage.topUsers
)