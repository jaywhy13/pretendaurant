import { CashierClient } from "../../clients/Cashier";
import { ClockClient } from "../../clients/Clock";
import { CustomerClient } from "../../clients/Customer";
import { LineClient } from "../../clients/Line";
import { advanceClockByTicks } from "../../clients/__tests__/utils";
import { Engine, EngineOptions } from "../Engine";

describe("Engine", () => {
  let customerClient: CustomerClient;
  let cashierClient: CashierClient;
  let clockClient: ClockClient;
  let lineClient: LineClient;
  let options: EngineOptions;
  let engine: Engine;
  const defaultOptions: EngineOptions = {
    numberOfCashiers: 4,
    numberOfLines: 4,
    numberOfCustomersToGenerate: 1,
    numberOfTicksBetweenCustomerGeneration: 1,
  };

  beforeEach(() => {
    customerClient = new CustomerClient();
    cashierClient = new CashierClient();
    lineClient = new LineClient();
    clockClient = new ClockClient();
  });

  describe("generation", () => {
    it("generates lines at the start", () => {
      options = { ...defaultOptions, numberOfLines: 4 };
      engine = new Engine({ lineClient, customerClient, cashierClient, clockClient, options });

      clockClient.start();

      const lines = lineClient.list();
      expect(lines).toHaveLength(4);
    });

    it("generates cashiers at the start", () => {
      options = { ...defaultOptions, numberOfLines: 4 };
      engine = new Engine({ lineClient, customerClient, cashierClient, clockClient, options });

      clockClient.start();

      const cashiers = cashierClient.list();
      expect(cashiers).toHaveLength(4);
    });

    it("assigns cashiers to lines", () => {
      options = { ...defaultOptions, numberOfCashiers: 2, numberOfLines: 2 };
      engine = new Engine({ lineClient, customerClient, cashierClient, clockClient, options });

      clockClient.start();

      const linesWithoutCashiers = lineClient.list({ filters: { cashierId: undefined } });
      expect(linesWithoutCashiers).toHaveLength(0);
    });

    it("generates customers at the prescribed rate", () => {
      options = {
        ...defaultOptions,
        numberOfCustomersToGenerate: 1,
        numberOfTicksBetweenCustomerGeneration: 1,
      };
      engine = new Engine({ lineClient, customerClient, cashierClient, clockClient, options });

      clockClient.start();

      expect(customerClient.list()).toHaveLength(0);

      advanceClockByTicks(clockClient, 1);

      expect(customerClient.list()).toHaveLength(1);

      advanceClockByTicks(clockClient, 1);

      expect(customerClient.list()).toHaveLength(2);
    });
  });
});
