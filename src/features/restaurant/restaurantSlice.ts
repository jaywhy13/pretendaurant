import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Line } from "../../types";

export interface restaurantState {
    lines: Line[];
}

const initialState: restaurantState = {
    lines: []
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        linesUpdated: (state: restaurantState, action: PayloadAction<Line[]>) => {
            state.lines = [...action.payload];
        },
    }
})

export const { linesUpdated } = restaurantSlice.actions;


export default restaurantSlice.reducer;