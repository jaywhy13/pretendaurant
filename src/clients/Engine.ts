import { customerClient, CustomerClient } from "../clients/Customer";
import { lineClient, LineClient } from "../clients/Line";
import { Cashier, Customer, Line } from "../types";
import { cashierClient, CashierClient } from "../clients/Cashier";
import { clockClient, ClockClient } from "../clients/Clock";
import { queueClient, QueueClient } from "../clients/Queue";

export interface EngineOptions {
  numberOfLines: number;
  numberOfCashiers: number;
  // Customer generation
  numberOfCustomersToGenerate: number;
  numberOfTicksBetweenCustomerGeneration: number;
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
export class EngineClient {
  private lineClient: LineClient;
  private queueClient: QueueClient;
  private customerClient: CustomerClient;
  private cashierClient: CashierClient;
  private clockClient: ClockClient;
  private options: EngineOptions;

  constructor({
    lineClient,
    customerClient,
    cashierClient,
    clockClient,
    queueClient,
    options,
  }: {
    lineClient: LineClient;
    customerClient: CustomerClient;
    cashierClient: CashierClient;
    clockClient: ClockClient;
    queueClient: QueueClient;
    options: EngineOptions;
  }) {
    this.lineClient = lineClient;
    this.customerClient = customerClient;
    this.cashierClient = cashierClient;
    this.queueClient = queueClient;
    this.clockClient = clockClient;
    this.options = options;

    this.clockClient.addOnTickCallback(async (timeElapsed: number) => {
      await this.processTick(timeElapsed);
    });
  }

  private async processTick(timeElapsed: number) {
    const { numberOfTicksBetweenCustomerGeneration, numberOfCustomersToGenerate } = this.options;
    if (timeElapsed === 0) {
      console.log("Processing tick for timeElapsed", timeElapsed);
      this.generateLines();
      await this.generateCashiers();
      await this.assignCashiersToLines();
      console.log("Finished processing tick for timeElapsed", timeElapsed)
    } else if (timeElapsed % numberOfTicksBetweenCustomerGeneration === 0) {
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

  public async generateCashiers(): Promise<Cashier[]> {
    const { numberOfCashiers } = this.options;
    const cashiers: Cashier[] = [];
    for (let i = 0; i < numberOfCashiers; i++) {
      let speed = 1 + parseInt((Math.random() * 10).toString());
      cashiers.push(await this.cashierClient.create(speed));
    }
    return cashiers;
  }

  public async assignCashiersToLines() {
    const cashiers = await this.cashierClient.list();
    for (let i = 0; i < cashiers.length; i++) {
      let cashier = cashiers[i];
      const lines = this.lineClient.getLinesWithoutCashiers();
      if (lines.length > 0) {
        const line = lines[0];
        console.log(`Assigning cashier ${cashier.id} to line ${line.id}`);
        this.lineClient.addCashierToLine(line.id, cashier.id);
      }
    }
  }

  public generateCustomers(numberOfCustomers: number): Customer[] {
    console.log(`Generating ${numberOfCustomers} customers`);
    const customers: Customer[] = [];

    for (let i = 0; i < numberOfCustomers; i++) {
      const customer = this.customerClient.create({
        patience: 10 + Math.floor(Math.random() * 50),
      });
      customers.push(customer);
      this.queueClient.addCustomer(customer.id);
    }
    return customers;
  }
}

const options: EngineOptions = {
  numberOfLines: 4,
  numberOfCashiers: 4,
  numberOfCustomersToGenerate: 2,
  numberOfTicksBetweenCustomerGeneration: 4,
};
export const engineClient = new EngineClient({
  lineClient,
  customerClient,
  cashierClient,
  clockClient,
  queueClient,
  options,
});
