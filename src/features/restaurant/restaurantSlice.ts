import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerInLine, Line } from "../../types";

export interface restaurantState {
  lines: Line[];
  customersInLine: CustomerInLine[];
}

const initialState: restaurantState = {
  lines: [],
  customersInLine: [],
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    linesUpdated: (state: restaurantState, action: PayloadAction<Line[]>) => {
      state.lines = [...action.payload];
    },
    customersInLineUpdated: (state: restaurantState, action: PayloadAction<CustomerInLine[]>) => {
      console.log("customersInLineUpdated", action.payload);

      state.customersInLine = [...action.payload];
    }
  }
})

export const { linesUpdated, customersInLineUpdated } = restaurantSlice.actions;


export default restaurantSlice.reducer;
