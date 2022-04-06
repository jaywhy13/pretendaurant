import { customerClient, CustomerClient } from '../clients/Customer';
import { lineClient, LineClient } from '../clients/Line';
import { Cashier, Customer, Line } from '../types';
import { cashierClient, CashierClient } from '../clients/Cashier';
import { clockClient, ClockClient } from "../clients/Clock";

export interface EngineOptions {
    numberOfLines: number,
    numberOfCashiers: number,
    // Customer generation
    numberOfCustomersToGenerate: number,
    numberOfTicksBetweenCustomerGeneration: number,
}


/**
 * Some things to consider here:
 * - Is the Engine a client, or a backend facility?
 * - I've thought of it as a utility running in the background that
 * would utilize the backend APIs.
 * So it'd probably talk to whatever the clients talk to.
 * It probably wouldn't be using the clients directly.
 * Anyway, if the engine exists on the frontend, it's not a client
 */
export class Engine {

    private lineClient: LineClient;
    private customerClient: CustomerClient;
    private cashierClient: CashierClient;
    private clockClient: ClockClient;
    private options: EngineOptions;

    constructor({ lineClient, customerClient, cashierClient, clockClient, options }: { lineClient: LineClient, customerClient: CustomerClient, cashierClient: CashierClient, clockClient: ClockClient, options: EngineOptions }) {
        this.lineClient = lineClient;
        this.customerClient = customerClient;
        this.cashierClient = cashierClient;
        this.clockClient = clockClient;
        this.options = options;

        this.clockClient.addOnTickCallback((timeElapsed: number) => {
            this.processTick(timeElapsed)
        })
    }

    private processTick(timeElapsed: number) {
        const { numberOfTicksBetweenCustomerGeneration, numberOfCustomersToGenerate } = this.options;
        if (timeElapsed === 0) {
            this.generateLines();
            this.generateCashiers();
            this.assignCashiersToLines();
        }
        else if (timeElapsed % numberOfTicksBetweenCustomerGeneration === 0) {
            this.generateCustomers(numberOfCustomersToGenerate);
        }
    }

    public generateLines(): Line[] {
        const lines: Line[] = [];
        for (let i = 0; i < this.options.numberOfLines; i++) {
            lines.push(this.lineClient.create({}));
        }
        return lines;
    }

    public generateCashiers(): Cashier[] {
        const { numberOfCashiers } = this.options;
        const cashiers: Cashier[] = [];
        for (let i = 0; i < numberOfCashiers; i++) {
            let speed = 1 + parseInt((Math.random() * 10).toString())
            cashiers.push(this.cashierClient.create(speed));
        }
        return cashiers;
    }

    public assignCashiersToLines() {
        const cashiers = this.cashierClient.list();
        cashiers.forEach(cashier => {
            const lines = this.lineClient.getLinesWithoutCashiers();
            const line = lines[0];
            this.lineClient.addCashierToLine(line.id, cashier.id);
        })
    }

    public generateCustomers(numberOfCustomers: number): Customer[] {
        const customers: Customer[] = [];

        for (let i = 0; i < numberOfCustomers; i++) {
            const customer = this.customerClient.create({
                patience: 10 + Math.floor(Math.random() * 50)
            }
            )
            customers.push(customer);
        }
        return customers;
    }
}

const options: EngineOptions = {
    numberOfLines: 4,
    numberOfCashiers: 4,
    numberOfCustomersToGenerate: 2,
    numberOfTicksBetweenCustomerGeneration: 4
};
export const engine = new Engine({ lineClient, customerClient, cashierClient, clockClient, options });