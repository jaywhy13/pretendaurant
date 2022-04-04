import { customerService } from './Customer';
import { lineService } from './Line';
import { Cashier, Customer, Line } from '../types';
import { cashierService } from './Cashier';
import { queueService } from './Queue';


class Engine {

    public generateLines(): Line[] {
        const NUMBER_OF_LINES = 4;
        const lines: Line[] = [];
        for (let i = 0; i < NUMBER_OF_LINES; i++) {
            lines.push(lineService.create({}));
        }
        return lines;
    }

    public generateCashiers(): Cashier[] {
        const NUMBER_OF_CASHIERS = 4;
        const cashiers: Cashier[] = [];
        for (let i = 0; i < NUMBER_OF_CASHIERS; i++) {
            let speed = 1 + parseInt((Math.random() * 10).toString())
            cashiers.push(cashierService.create(speed));
        }
        return cashiers;
    }

    public assignCashiersToLines() {
        const cashiers = cashierService.list();
        cashiers.forEach(cashier => {
            const lines = lineService.getLinesWithoutCashiers();
            const line = lines[0];
            lineService.addCashierToLine(line.id, cashier.id);
        })
    }

    public generateCustomers(): Customer[] {
        const customers: Customer[] = [];
        const NUMBER_OF_CUSTOMERS = 1 + parseInt((Math.random() * 20).toString());
        console.log("Generating", NUMBER_OF_CUSTOMERS, "customers");

        // Add some dummy customers
        for (let i = 0; i < NUMBER_OF_CUSTOMERS; i++) {
            const customer = customerService.create(
                10 + Math.floor(Math.random() * 50)
            )
            customers.push(customer);
            // Also add the customer to the restaurant queue
            queueService.addCustomer(customer.id);
        }
        return customers;
    }

}

export const engine = new Engine();