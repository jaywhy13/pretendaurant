import { CashierClient } from "../../clients/Cashier";
import { ClockClient } from "../../clients/Clock";
import { CustomerClient } from "../../clients/Customer";
import { EngineClient, EngineOptions } from "../../clients/Engine";
import { LineClient } from "../../clients/Line";
import { QueueClient } from "../../clients/Queue";
import { advanceClockByTicks } from "../../clients/__tests__/utils";

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

describe("Engine", () => {
  let customerClient: CustomerClient;
  let cashierClient: CashierClient;
  let clockClient: ClockClient;
  let lineClient: LineClient;
  let options: EngineOptions;
  let engine: EngineClient;
  let queueClient: QueueClient;
  const defaultOptions: EngineOptions = {
    numberOfCashiers: 4,
    numberOfLines: 4,
    numberOfCustomersToGenerate: 1,
    numberOfTicksBetweenCustomerGeneration: 1,
    numberOfTicksBetweenAssigningCustomersToLines: 1,
  };

  beforeEach(() => {
    customerClient = new CustomerClient();
    cashierClient = new CashierClient();
    lineClient = new LineClient(customerClient);
    clockClient = new ClockClient();
    queueClient = new QueueClient();
  });

  afterEach(() => {
    // Remove callbacks before the test flushes timers
    // After the test is finishedm, it flushes all the 
    // timers, which would call our callback and cause
    // confusion and test failures.
    // Using this manual method until we find a better way
    if (clockClient) {
      clockClient.clearOnTickCallbacks();
    }
  });

  describe("generation", () => {
    it("generates lines at the start", async () => {
      options = { ...defaultOptions, numberOfLines: 4 };
      engine = new EngineClient({ lineClient, customerClient, cashierClient, clockClient, queueClient, options });

      await clockClient.start();

      const lines = lineClient.list();
      expect(lines).toHaveLength(4);
    });

    it("generates cashiers at the start", async () => {
      options = { ...defaultOptions, numberOfLines: 4 };
      engine = new EngineClient({ lineClient, customerClient, cashierClient, clockClient, queueClient, options });

      await clockClient.start();

      const cashiers = await cashierClient.list();
      expect(cashiers).toHaveLength(4);
    });

    it("assigns cashiers to lines", async () => {
      options = { ...defaultOptions, numberOfCashiers: 2, numberOfLines: 2 };
      engine = new EngineClient({ lineClient, customerClient, cashierClient, clockClient, queueClient, options });

      await clockClient.start();

      const linesWithoutCashiers = lineClient.list({ filters: { cashierId: undefined } });
      expect(linesWithoutCashiers).toHaveLength(0);
    });

    it("generates customers at the prescribed rate", async () => {
      options = {
        ...defaultOptions,
        // Generate 1 customer after each tick
        numberOfCustomersToGenerate: 1,
        numberOfTicksBetweenCustomerGeneration: 1,
      };
      engine = new EngineClient({ lineClient, customerClient, cashierClient, clockClient, queueClient, options });

      await clockClient.start();

      expect(await customerClient.list()).toHaveLength(0);

      advanceClockByTicks(clockClient, 1);

      expect(await customerClient.list()).toHaveLength(1);

      advanceClockByTicks(clockClient, 1);

      expect(await customerClient.list()).toHaveLength(2);
    });

    it('assigns customers to the lines', async () => {
      options = {
        ...defaultOptions,
        // Generate 1 customer to be added to one line
        numberOfLines: 1,
        numberOfCustomersToGenerate: 1,
        // Generate 1 customer after each tick
        numberOfTicksBetweenCustomerGeneration: 1,
      };
      engine = new EngineClient({ lineClient, customerClient, cashierClient, clockClient, queueClient, options });

      await clockClient.start();

      // This should assign customers to the lines
      advanceClockByTicks(clockClient, 1);

      const line = lineClient.list()[0];
      const customer = (await customerClient.list())[0];
      const customersInLine = lineClient.getCustomersInLine(line.id);

      expect(customersInLine).toHaveLength(1);
      expect(customersInLine[0].customer.id).toEqual(customer.id);

    });

    it.only('removes customers from the quueue', async () => {

      options = {
        ...defaultOptions,
        // Generate 1 customer to be added to one line
        numberOfLines: 1,
        numberOfCustomersToGenerate: 1,
        // Generate 1 customer after each tick
        numberOfTicksBetweenCustomerGeneration: 1,
      };
      engine = new EngineClient({ lineClient, customerClient, cashierClient, clockClient, queueClient, options });

      await clockClient.start();

      console.log("Assert that the queue is empty")
      expect(queueClient.list()).toHaveLength(0);
      expect(await customerClient.list()).toHaveLength(0);

      // This should assign customers to the lines
      console.log("Advance the clock by 1 tick")
      advanceClockByTicks(clockClient, 1);
      console.log("Clock advanced by 1 tick")

      // await flushPromises();

      console.log("Lets check the queue length now in the test")

      expect(queueClient.list()).toHaveLength(0);

    });



  });
});
