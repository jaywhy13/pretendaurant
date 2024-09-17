import { v4 as uuidv4 } from "uuid";
import { CustomerClient } from "../Customer";
import { LineClient, LineOrderBy, Order } from "../Line";

describe("Line Client", () => {
  let lineClient: LineClient;
  let customerClient: CustomerClient;

  beforeEach(() => {
    customerClient = new CustomerClient();
    lineClient = new LineClient(customerClient);
  });

  describe("create", () => {
    it("creates lines with an ID", () => {
      const cashierId = uuidv4();
      const line = lineClient.create({ cashierId });
      expect(line.id).toBeTruthy();
    });

    it("creates lines with cashier", () => {
      const cashierId = uuidv4();
      const line = lineClient.create({ cashierId });
      expect(line).toMatchObject({ cashierId });
    });
  });

  describe("list", () => {
    it("orders lines by length ascending", async () => {
      const customer1 = customerClient.create({});
      const customer2 = customerClient.create({});
      const customer3 = customerClient.create({});

      const lineWithTwoCustomers = lineClient.create({});

      [customer1.id, customer2.id].forEach(async (customerId) => {
        await lineClient.addCustomerToLine(lineWithTwoCustomers.id, customerId);
      });

      const lineWithOneCustomer = lineClient.create({});
      await lineClient.addCustomerToLine(lineWithOneCustomer.id, customer3.id);

      const lineWithNoCustomers = lineClient.create({});

      const lines = lineClient.list({
        order: Order.ASCENDING,
        orderBy: LineOrderBy.CUSTOMERS_IN_LINE,
      });
      const lineIds = lines.map((line) => line.id);

      expect(lineIds).toEqual([
        lineWithNoCustomers.id,
        lineWithOneCustomer.id,
        lineWithTwoCustomers.id,
      ]);
    });

    it("orders lines by length descending", async () => {
      const customer1 = customerClient.create({});
      const customer2 = customerClient.create({});
      const customer3 = customerClient.create({});

      const lineWithTwoCustomers = lineClient.create({});
      [customer1.id, customer2.id].forEach(async (customerId) => {
        await lineClient.addCustomerToLine(lineWithTwoCustomers.id, customerId);
      });

      const lineWithOneCustomer = lineClient.create({});
      await lineClient.addCustomerToLine(lineWithOneCustomer.id, customer3.id);

      const lineWithNoCustomers = lineClient.create({});

      const lines = lineClient.list({
        order: Order.DESCENDING,
        orderBy: LineOrderBy.CUSTOMERS_IN_LINE,
      });
      const lineIds = lines.map((line) => line.id);

      expect(lineIds).toEqual([
        lineWithTwoCustomers.id,
        lineWithOneCustomer.id,
        lineWithNoCustomers.id,
      ]);
    });

    describe("filters", () => {
      it("returns cashier if correct ID is provided", () => {
        const cashierId = uuidv4();
        const line = lineClient.create({ cashierId });

        const lines = lineClient.list({ filters: { cashierId } });
        expect(lines).toHaveLength(1);

        expect(lines[0]).toMatchObject({ cashierId });
      });

      it("returns nothing if incorrect ID is provided", () => {
        const cashierId = uuidv4();
        const line = lineClient.create({ cashierId });

        // Pass a different ID
        const lines = lineClient.list({
          filters: { cashierId: uuidv4() },
        });
        expect(lines).toHaveLength(0);
      });

      it("allows filtering by no cashiers", () => {
        const line = lineClient.create({}); // create line without cashier
        const lines = lineClient.list({
          filters: { cashierId: undefined },
        });
        expect(lines).toHaveLength(1);
        expect(lines[0]).toMatchObject({ cashierId: undefined });
      });
    });
  });

  describe("customers in line", () => {
    it("add customers to the line", async () => {
      const cashierId = uuidv4();
      const line = lineClient.create({ cashierId });
      const customer = customerClient.create({});
      const customerInLine = await lineClient.addCustomerToLine(line.id, customer.id);

      expect(customerInLine).toEqual({ lineId: line.id, customer });
    });

    it("add customers to the line object", async () => {
      const cashierId = uuidv4();
      let line = lineClient.create({ cashierId });

      const customer = customerClient.create({});
      const customerInLine = await lineClient.addCustomerToLine(line.id, customer.id);

      line = lineClient.get(line.id)!;
      expect(line.customersInLine).toEqual([customerInLine]);
    });

    it("removes customers from the line", async () => {
      const cashierId = uuidv4();
      const line = lineClient.create({ cashierId });

      const customer = customerClient.create({});
      const customerInLine = await lineClient.addCustomerToLine(line.id, customer.id);

      const anotherCustomer = customerClient.create({});
      const anotherCustomerInLine = await lineClient.addCustomerToLine(line.id, anotherCustomer.id);

      lineClient.removeCustomerFromLine(line.id, customer.id);

      const customersInLine = lineClient.getCustomersInLine(line.id);
      expect(customersInLine).not.toContainEqual(customerInLine);

      expect(customersInLine).toContainEqual(anotherCustomerInLine);
    });

    it("gets emptiest line", async () => {
      const customer1 = customerClient.create({});
      const customer2 = customerClient.create({});
      const customer3 = customerClient.create({});

      const lineWithTwoCustomers = lineClient.create({});
      [customer1.id, customer2.id].forEach(async (customerId) => {
        await lineClient.addCustomerToLine(lineWithTwoCustomers.id, customerId);
      });

      const lineWithOneCustomer = lineClient.create({});
      await lineClient.addCustomerToLine(lineWithOneCustomer.id, customer3.id);

      const lineWithNoCustomers = lineClient.create({});

      const emptiestLine = lineClient.getEmptiestLine();
      expect(emptiestLine).toMatchObject(lineWithNoCustomers);
    });
  });

  describe("cashier", () => {
    it("adds cashier to the line", () => {
      const cashierId = uuidv4();
      const line = lineClient.create({});

      const updatedLine = lineClient.addCashierToLine(line.id, cashierId);

      expect(updatedLine).not.toBeUndefined();
      expect(updatedLine!.cashierId).toBe(cashierId);
    });

    it("removes cashier from the line", () => {
      const cashierId = uuidv4();
      const line = lineClient.create({ cashierId });

      const lineWithCashierRemoved = lineClient.removeCashierFromLine(line.id, cashierId);
      expect(lineWithCashierRemoved).not.toBeUndefined();
      expect(lineWithCashierRemoved!.cashierId).toBeUndefined();
    });
  });
});
