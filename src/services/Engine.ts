import { customerService } from './Customer';
import { lineService } from './Line';
import { Customer, Line } from '../types';


class Engine {


    public generateLines(): Line[] {
        const NUMBER_OF_LINES = 4;
        const lines: Line[] = [];
        for (let i = 0; i < NUMBER_OF_LINES; i++) {
            lines.push(lineService.create({}));
        }
        return lines;
    }

    public generateCustomers(): Customer[] {
        const customers: Customer[] = [];
        const NUMBER_OF_CUSTOMERS = 1 + parseInt((Math.random() * 20).toString());
        console.log("Generating", NUMBER_OF_CUSTOMERS, "customers");

        // Add some dummy customers
        for (let i = 0; i < NUMBER_OF_CUSTOMERS; i++) {
            customers.push(customerService.create(
                Math.floor(Math.random() * 10)
            ));
        }
        return customers;
    }

}

export const engine = new Engine();