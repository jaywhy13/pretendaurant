import { PayloadAction } from "@reduxjs/toolkit";
import { Middleware } from "@reduxjs/toolkit";
import { engine } from "../../services/Engine";
import store from "../../store";
import { timeStarted } from "../clock/clockSlice";
import { linesGenerated, customersGenerated } from "./engineSlice";


export const customerGenerationMiddleware: Middleware = ({ getState }) => {
    return next => (action: PayloadAction) => {
        if (action.type === timeStarted.type) {
            const customers = engine.generateCustomers();
            store.dispatch(customersGenerated(customers));
        }
        return next(action);
    }
}

export const lineGenerationMiddleware: Middleware = ({ getState }) => {
    return next => (action: PayloadAction) => {
        if (action.type === timeStarted.type) {
            const lines = engine.generateLines();
            store.dispatch(linesGenerated(lines));
        }
        return next(action);
    }
}


