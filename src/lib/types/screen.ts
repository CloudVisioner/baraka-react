import { Member } from "./member";
import { Product } from "./product";

export interface ApprootState {
    homePage: HomePageState;
}

export interface HomePageState{
    popularDishes: Product[];
    newDishes: Product[];
    topUsers: Member[];
}