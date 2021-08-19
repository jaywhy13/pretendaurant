import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer, Line } from "../../types";


interface EngineState {
    customersGenerated: Customer[];
    linesGenerated: Line[];
}

const initialState: EngineState = {
    customersGenerated: [],
    linesGenerated: []
}

const engineSlice = createSlice({
    name: 'engine',
    initialState,
    reducers: {
        customersGenerated: (state, action: PayloadAction<Customer[]>) => {
            state.customersGenerated = action.payload;
        },
        linesGenerated: (state, action: PayloadAction<Line[]>) => {
            state.linesGenerated = action.payload;
        }
    }
});

export const { customersGenerated, linesGenerated } = engineSlice.actions;


export default engineSlice.reducer;