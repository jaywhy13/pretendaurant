import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cashier, Customer, Fulfillment, Line } from "../../types";

export interface CustomerLineAssignment {
    customerId: string;
    lineId: string;
}


interface EngineState {
    customersGenerated: Customer[];
    linesGenerated: Line[];
    cashiersGenerated: Cashier[];
    customerLineAssignment?: CustomerLineAssignment;
    customerServed?: Fulfillment;
}

const initialState: EngineState = {
    customersGenerated: [],
    linesGenerated: [],
    cashiersGenerated: [],
    customerLineAssignment: undefined,
    customerServed: undefined,
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
        },
        cashiersGenerated: (state, action: PayloadAction<Cashier[]>) => {
            state.cashiersGenerated = action.payload;
        },
        customerAddedToLine: (state, action: PayloadAction<CustomerLineAssignment>) => {
            state.customerLineAssignment = action.payload;
        },
        customerServed: (state, action: PayloadAction<Fulfillment>) => {
            state.customerServed = action.payload;
        }
    }
});

export const { customersGenerated, linesGenerated, cashiersGenerated, customerAddedToLine, customerServed } = engineSlice.actions;


export default engineSlice.reducer;