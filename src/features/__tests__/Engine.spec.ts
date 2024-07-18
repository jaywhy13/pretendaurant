import { CashierClient } from "../../clients/Cashier";
import { ClockClient } from "../../clients/Clock";
import { CustomerClient } from "../../clients/Customer";
import { EngineClient, EngineOptions } from "../../clients/Engine";
import { LineClient } from "../../clients/Line";
import { QueueClient } from "../../clients/Queue";
import { advanceClockByTicks } from "../../clients/__tests__/utils";

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
  };

  beforeEach(() => {
    customerClient = new CustomerClient();
    cashierClient = new CashierClient();
    lineClient = new LineClient(customerClient);
    clockClient = new ClockClient();
    queueClient = new QueueClient();
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
      console.log("Checking the list of cachiers", cashiers)
      expect(cashiers).toHaveLength(4);
    });

    it("assigns cashiers to lines", async () => {
      options = { ...defaultOptions, numberOfCashiers: 2, numberOfLines: 2 };
      engine = new EngineClient({ lineClient, customerClient, cashierClient, clockClient, queueClient, options });

      await clockClient.start();

      const linesWithoutCashiers = lineClient.list({ filters: { cashierId: undefined } });
      console.log("Checking the list of lines without cashiers", linesWithoutCashiers)
      expect(linesWithoutCashiers).toHaveLength(0);
    });

    it("generates customers at the prescribed rate", async () => {
      options = {
        ...defaultOptions,
        numberOfCustomersToGenerate: 1,
        numberOfTicksBetweenCustomerGeneration: 1,
      };
      engine = new EngineClient({ lineClient, customerClient, cashierClient, clockClient, queueClient, options });

      await clockClient.start();

      expect(customerClient.list()).toHaveLength(0);

      advanceClockByTicks(clockClient, 1);

      expect(customerClient.list()).toHaveLength(1);

      advanceClockByTicks(clockClient, 1);

      expect(customerClient.list()).toHaveLength(2);
    });
  });
});
