import { CustomerClient } from "../clients/Customer";
import { LineClient, LineOrderBy } from "../clients/Line";
import { Cashier, Customer, Line } from "../types";
import { CashierClient } from "../clients/Cashier";
import { ClockClient } from "../clients/Clock";
import { QueueClient } from "../clients/Queue";

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
  private initialized: boolean;

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
    this.initialized = false;

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
      await this.assignCustomersToLines(1);
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

  public async assignCustomersToLines(numberOfCustomers: number = 1) {
    const customerIdsInQueue = this.queueClient.list();
    if (customerIdsInQueue.length === 0) {
      console.log("No customers in queue")
      return;
    }

    const customersIdsToAssign = customerIdsInQueue.slice(0, numberOfCustomers);
    for (let i = 0; i < customersIdsToAssign.length; i++) {
      const customerId = customersIdsToAssign[i];
      const lines = this.lineClient.list({ orderBy: LineOrderBy.CUSTOMERS_IN_LINE });
      const line = lines.length > 0 ? lines[0] : null;
      if (line !== null) {
        console.log(`Assigning customer ${customerId} to line ${line.id}`);
        this.lineClient.addCustomerToLine(line.id, customerId);
        this.queueClient.removeCustomer(customerId);
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

