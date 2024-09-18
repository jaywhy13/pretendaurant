import { CashierClient } from "../../clients/Cashier";
import { ClockClient } from "../../clients/Clock";
import { CustomerClient } from "../../clients/Customer";
import { EngineClient, EngineOptions } from "../../clients/Engine";
import { LineClient } from "../../clients/Line";
import { QueueClient } from "../../clients/Queue";
import { Customer } from "../../types";

describe("Engine", () => {
  describe("generation", () => {

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
      clockClient = new ClockClient();
    });


    it('generates cashiers at the start', async () => {
      options = { ...defaultOptions }
      engine = new EngineClient({ lineClient, customerClient, cashierClient, clockClient, queueClient, options });

      jest.spyOn(cashierClient, 'create');

      await clockClient.start();

      expect(cashierClient.create).not.toHaveBeenCalled();

    });
  });

});
