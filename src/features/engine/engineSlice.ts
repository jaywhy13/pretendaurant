import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cashier, Customer, CustomerInLine, Fulfillment, Line } from "../../types";

export interface CustomerLineAssignment {
  customer: Customer;
  lineId: string;
}

interface EngineState {
  customersGenerated: Customer[];
  linesGenerated: Line[];
  cashiersGenerated: Cashier[];
  customerLineAssignment?: CustomerLineAssignment;
  customerServed?: Fulfillment;
  customersInLine: CustomerInLine[];
}

const initialState: EngineState = {
  customersGenerated: [],
  linesGenerated: [],
  cashiersGenerated: [],
  customerLineAssignment: undefined,
  customerServed: undefined,
  customersInLine: [],
};

const engineSlice = createSlice({
  name: "engine",
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
      state.customersInLine.push(action.payload);
    },
    customerServed: (state, action: PayloadAction<Fulfillment>) => {
      state.customerServed = action.payload;
    },
  },
});

export const {
  customersGenerated,
  linesGenerated,
  cashiersGenerated,
  customerAddedToLine,
  customerServed,
} = engineSlice.actions;

export default engineSlice.reducer;
