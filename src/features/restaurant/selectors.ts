import { RootState } from "../../store";
import { Line } from "../../types";


export const selectLines = (state: RootState): Line[] => state.restaurant.lines;

