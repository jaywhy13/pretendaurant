import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { lineClient } from "../../clients/Line";
import store from "../../store";
import { CustomerInLine, Line } from "../../types";
import {
  cashiersGenerated,
  customerAddedToLine,
  customerServed,
  customersGenerated,
  linesGenerated,
} from "../engine/engineSlice";
import { linesUpdated, customersInLineUpdated } from "./restaurantSlice";

export const linesUpdatedMiddleware: Middleware = ({ getState }) => {
  return (next) => (action: PayloadAction<Line[]>) => {
    if (
      [
        customersGenerated.type,
        linesGenerated.type,
        cashiersGenerated.type,
        customerAddedToLine.type,
        customerServed.type,
      ].includes(action.type)
    ) {
      const lines = lineClient.list();
      store.dispatch(linesUpdated(lines));

      // TODO: Make this more efficient. Looping over each line isn't ideal.
      const customersInLines: CustomerInLine[] = [];
      lines.forEach((line) => {
        const customersInLine = lineClient.getCustomersInLine(line.id);
        customersInLines.push(...customersInLine);
      });
      store.dispatch(customersInLineUpdated(customersInLines));
    }
    return next(action);
  };
};
