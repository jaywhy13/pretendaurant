import { PayloadAction } from "@reduxjs/toolkit";
import { Middleware } from "@reduxjs/toolkit";
import { cashierService } from "../../services/Cashier";
import { clockService } from "../../services/Clock";
import { customerService } from "../../services/Customer";
import { engine } from "../../services/Engine";
import { fulfilmentService } from "../../services/Fulfillment";
import { lineService } from "../../services/Line";
import { queueService } from "../../services/Queue";
import store from "../../store";
import { timeElapsed, timeStarted } from "../clock/clockSlice";
import { linesGenerated, customersGenerated, cashiersGenerated, customerAddedToLine, customerServed } from "./engineSlice";


export const customerGenerationMiddleware: Middleware = ({ getState }) => {
    return next => (action: PayloadAction) => {
        if (action.type === timeStarted.type) {
            const customers = engine.generateCustomers();
            store.dispatch(customersGenerated(customers));
        } else if (action.type === timeElapsed.type) {
            // Generate customers every 10 ticks
            const timeElapsed = clockService.getTimeElapsed();
            if (timeElapsed % 10 === 0) {
                const customers = engine.generateCustomers();
                store.dispatch(customersGenerated(customers));
            }
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

export const cashierGenerationMiddleware: Middleware = () => {
    return next => (action: PayloadAction) => {
        if (action.type === timeStarted.type) {
            const cashiers = engine.generateCashiers();
            engine.assignCashiersToLines();
            store.dispatch(cashiersGenerated(cashiers));
        }
        return next(action);
    }
}

export const addCustomerToLineMiddleware: Middleware = ({ getState }) => {
    return next => (action: PayloadAction) => {
        if (action.type === timeElapsed.type) {
            const state = getState();
            const waitingCustomerIds = queueService.list();
            waitingCustomerIds.forEach(waitingCustomerId => {
                const emptiestLine = lineService.getEmptiestLine();
                if (emptiestLine) {
                    queueService.removeCustomer(waitingCustomerId);
                    lineService.addCustomerToLine(emptiestLine.id, waitingCustomerId);
                    store.dispatch(customerAddedToLine({ customerId: waitingCustomerId, lineId: emptiestLine.id }))
                }
                // TODO: Handle no empty lines
            })
        }
        return next(action);
    }
}

export const serveCustomerMiddleware: Middleware = ({ }) => {
    return next => (action: PayloadAction<number>) => {
        if (action.type === timeElapsed.type) {
            const lines = lineService.list();
            lines.forEach(line => {
                const cashier = cashierService.get(line.cashierId!);
                if (cashier) {
                    const cashierId = cashier.id;
                    const lineId = line.id;
                    const speed = cashier?.speed!;
                    const timeElapsed = clockService.getTimeElapsed();
                    if ((timeElapsed % speed) === 0) {
                        // cashier is due to serve again
                        if (line.customerIds.length) {
                            const customerId = line.customerIds[0];
                            // serve the customer, then remove them from the line
                            fulfilmentService.serveCustomer(line.id, customerId, cashier.id);
                            lineService.removeCustomerFromLine(line.id, customerId);
                            store.dispatch(customerServed({ cashierId, lineId, customerId, duration: 0 }))
                        }
                    }
                }
            })
        }
        return next(action);
    }
}

export const angryCustomerMiddleware: Middleware = ({ }) => {
    return next => (action: PayloadAction<number>) => {
        if (action.type === timeElapsed.type) {
            const lines = lineService.list();
            lines.forEach(line => {
                line.customerIds.forEach(customerId => {
                    const customer = customerService.get(customerId);
                    if (customer) {
                        const isServed = fulfilmentService.list(line.id, customerId).length > 0;
                        if (!isServed) {
                            const patience = customer.patience;
                            const timeElapsed = clockService.getTimeElapsed();
                            if (patience <= timeElapsed) {
                                console.log(customer.id, "is leaving the restaurant. patience is", patience, "timeElapsed is", timeElapsed);
                                lineService.removeCustomerFromLine(line.id, customer.id);
                            }
                        }
                    }
                })

            })
        }
        return next(action);
    }
}

