import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { lineClient } from "../../clients/Line";
import store from "../../store";
import { Line } from "../../types";
import { cashiersGenerated, customerAddedToLine, customerServed, customersGenerated, linesGenerated } from "../engine/engineSlice";
import { linesUpdated } from "./restaurantSlice";

export const linesUpdatedMiddleware: Middleware = ({ getState }) => {
    return next => (action: PayloadAction<Line[]>) => {
        if ([customersGenerated.type, linesGenerated.type, cashiersGenerated.type, customerAddedToLine.type, customerServed.type].includes(action.type)) {
            const lines = lineClient.list()
            store.dispatch(linesUpdated(lines));
        }
        return next(action);
    }
}



