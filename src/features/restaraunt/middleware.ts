import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { lineService } from "../../services/Line";
import store from "../../store";
import { Customer, Line } from "../../types";
import { timeElapsed } from "../clock/clockSlice";
import { customersGenerated, linesGenerated } from "../engine/engineSlice";
import { addCustomerToLine, customersAdded, linesAdded } from "./restarauntSlice";
import { selectCustomersWaitingToJoinLine, selectEmptiestLine } from "./selectors";

export const addCustomerToQueueMiddleware: Middleware = ({ getState }) => {
    return next => (action: PayloadAction<Customer[]>) => {
        if (action.type === customersGenerated.type) {
            console.log('customer queue got action', action);
            store.dispatch(customersAdded(action.payload))
        }
        return next(action);
    }
}

export const addCustomerToLineMiddleware: Middleware = ({ getState }) => {
    return next => (action: PayloadAction) => {
        if (action.type === timeElapsed.type) {
            const state = getState();
            const waitingCustomers = selectCustomersWaitingToJoinLine(state);
            waitingCustomers.forEach(waitingCustomer => {
                const emptiestLine = lineService.getEmptiestLine();
                if (emptiestLine) {
                    lineService.addCustomerToLine(emptiestLine.id, waitingCustomer);
                    store.dispatch(addCustomerToLine({ customer: waitingCustomer, line: emptiestLine }))
                }
                // TODO: Handle no empty lines
            })
        }
        return next(action);
    }
}

export const lineSetupMiddleware: Middleware = ({ getState }) => {
    return next => (action: PayloadAction<Line[]>) => {
        if (action.type === linesGenerated.type) {
            store.dispatch(linesAdded(action.payload))
        }
        return next(action);
    }
}


