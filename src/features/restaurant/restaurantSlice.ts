import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer, Line } from "../../types";

export interface restaurantState {
    customersWaitingToJoinLine: Customer[];
    lines: Line[];
}

const initialState: restaurantState = {
    customersWaitingToJoinLine: [],
    lines: []
};

export interface CustomerLineAssignment {
    customer: Customer;
    line: Line;
}

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        customersAdded: (state: restaurantState, action: PayloadAction<Customer[]>) => {
            console.log("Adding customers to waiting list", action.payload);
            state.customersWaitingToJoinLine = state.customersWaitingToJoinLine.concat(action.payload);
        },
        linesAdded: (state: restaurantState, action: PayloadAction<Line[]>) => {
            state.lines = action.payload;
        },
        addCustomerToLine: (state: restaurantState, action: PayloadAction<CustomerLineAssignment>) => {
            const { customer, line } = action.payload;
            console.log("Adding", customer.id, "to", line.id);
            // Remove the customer from the queue
            state.customersWaitingToJoinLine = state.customersWaitingToJoinLine.filter(candidateCustomer => candidateCustomer.id !== customer.id);
            const lineInState = state.lines.find(candidateLine => candidateLine.id === line.id);
            // Add them to the line
            const updatedLine = {
                ...line,
                customers: lineInState!.customers.concat([customer])
            };
            state.lines = state.lines.map(lineInState => lineInState.id === line.id ? updatedLine : lineInState);
        }
    }
})

export const { customersAdded, linesAdded, addCustomerToLine } = restaurantSlice.actions;


export default restaurantSlice.reducer;