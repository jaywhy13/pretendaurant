import { PayloadAction } from "@reduxjs/toolkit";
import { Middleware } from "@reduxjs/toolkit";
import { cashierClient } from "../../clients/Cashier";
import { clockClient } from "../../clients/Clock";
import { customerClient } from "../../clients/Customer";
import { engineClient } from "../../clients/Engine";
import { fulfilmentClient } from "../../clients/Fulfillment";
import { lineClient } from "../../clients/Line";
import { queueClient } from "../../clients/Queue";
import store from "../../store";
import { timeElapsed, timeStarted } from "../clock/clockSlice";
import {
  linesGenerated,
  customersGenerated,
  cashiersGenerated,
  customerAddedToLine,
  customerServed,
} from "./engineSlice";

export const customerGenerationMiddleware: Middleware = ({ }) => {
  return (next) => (action: PayloadAction) => {
    if (action.type === timeStarted.type) {
      const customers = engineClient.generateCustomers(5);
      store.dispatch(customersGenerated(customers));
    } else if (action.type === timeElapsed.type) {
      // Generate customers every 10 ticks
      const timeElapsed = clockClient.getTimeElapsed();
      if (timeElapsed % 10 === 0) {
        const customers = engineClient.generateCustomers(2);
        store.dispatch(customersGenerated(customers));
      }
    }
    return next(action);
  };
};

export const lineGenerationMiddleware: Middleware = ({ }) => {
  return (next) => (action: PayloadAction) => {
    if (action.type === timeStarted.type) {
      const lines = engineClient.generateLines();
      store.dispatch(linesGenerated(lines));
    }
    return next(action);
  };
};

export const cashierGenerationMiddleware: Middleware = async () => {
  return (next) => (action: PayloadAction) => {
    if (action.type === timeStarted.type) {
      const cashiers = await engineClient.generateCashiers();
      engineClient.assignCashiersToLines();
      store.dispatch(cashiersGenerated(cashiers));
    }
    return next(action);
  };
};

export const addCustomerToLineMiddleware: Middleware = ({ getState }) => {
  return (next) => (action: PayloadAction) => {
    if (action.type === timeElapsed.type) {
      const state = getState();
      const waitingCustomerIds = queueClient.list();
      console.log("There are the waiting customers", waitingCustomerIds);
      waitingCustomerIds.forEach((waitingCustomerId) => {
        const emptiestLine = lineClient.getEmptiestLine();
        if (emptiestLine) {
          queueClient.removeCustomer(waitingCustomerId);
          console.log("Adding customer", waitingCustomerId, "to line", emptiestLine.id);
          const customerInLine = lineClient.addCustomerToLine(emptiestLine.id, waitingCustomerId);
          console.log("Resulting customer in line", customerInLine);
          store.dispatch(
            customerAddedToLine({ customer: customerInLine.customer, lineId: emptiestLine.id })
          );
        }
        // TODO: Handle no empty lines
      });
    }
    return next(action);
  };
};

export const serveCustomerMiddleware: Middleware = async ({ }) => {
  return (next) => (action: PayloadAction<number>) => {
    if (action.type === timeElapsed.type) {
      const lines = lineClient.list();
      lines.forEach((line) => {
        const cashier = await cashierClient.get(line.cashierId!);
        if (cashier) {
          const cashierId = cashier.id;
          const lineId = line.id;
          const speed = cashier?.speed!;
          const timeElapsed = clockClient.getTimeElapsed();
          if (timeElapsed % speed === 0) {
            const customersInLine = lineClient.getCustomersInLine(line.id);
            // cashier is due to serve again
            if (customersInLine.length) {
              const customerId = customersInLine[0].customer.id;
              // serve the customer, then remove them from the line
              const fulfillment = fulfilmentClient.serveCustomer({
                lineId,
                customerId,
                cashierId,
                duration: 0,
              });
              lineClient.removeCustomerFromLine(line.id, customerId);
              store.dispatch(customerServed(fulfillment));
            }
          }
        }
      });
    }
    return next(action);
  };
};

export const angryCustomerMiddleware: Middleware = ({ }) => {
  return (next) => (action: PayloadAction<number>) => {
    if (action.type === timeElapsed.type) {
      const lines = lineClient.list();
      lines.forEach((line) => {
        const customersInLine = lineClient.getCustomersInLine(line.id);
        customersInLine.forEach((customerInLine) => {
          const customerId = customerInLine.customer.id;
          const customer = customerClient.get(customerId);
          if (customer) {
            const isServed = fulfilmentClient.list(line.id, customerId).length > 0;
            if (!isServed) {
              const patience = customer.patience;
              const timeElapsed = clockClient.getTimeElapsed();
              if (patience <= timeElapsed) {
                console.log(
                  customer.id,
                  "is leaving the restaurant. patience is",
                  patience,
                  "timeElapsed is",
                  timeElapsed
                );
                lineClient.removeCustomerFromLine(line.id, customer.id);
              }
            }
          }
        });
      });
    }
    return next(action);
  };
};
