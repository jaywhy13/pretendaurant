import { RootState } from "../../store";
import { Line } from "../../types";

export const selectLines = (state: RootState): Line[] => state.restaurant.lines;

export const selectCustomersInLine = (state: RootState, lineId: string) => {
  return state.restaurant.customersInLine.filter(
    (customerInLine) => customerInLine.lineId === lineId
  );
};
