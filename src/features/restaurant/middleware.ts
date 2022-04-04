import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { lineService } from "../../services/Line";
import store from "../../store";
import { Line } from "../../types";
import { cashiersGenerated, customerAddedToLine, customerServed, customersGenerated, linesGenerated } from "../engine/engineSlice";
import { linesUpdated } from "./restaurantSlice";

export const lineSetupMiddleware: Middleware = ({ getState }) => {
    return next => (action: PayloadAction<Line[]>) => {
        if (action.type === linesGenerated.type) {
            store.dispatch(linesAdded(action.payload))
        }
        return next(action);
    }
}


