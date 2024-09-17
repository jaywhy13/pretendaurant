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
    it("creates lines with an ID", async () => {
      const cashierId = uuidv4();
      const line = await lineClient.create({ cashierId });
      expect(line.id).toBeTruthy();
    });

    it("creates lines with cashier", async () => {
      const cashierId = uuidv4();
      const line = await lineClient.create({ cashierId });
      expect(line).toMatchObject({ cashierId });
    });
  });

  describe("list", () => {
    it("orders lines by length ascending", async () => {
      const customer1 = await customerClient.create({});
      const customer2 = await customerClient.create({});
      const customer3 = await customerClient.create({});

      const lineWithTwoCustomers = await lineClient.create({});

      [customer1.id, customer2.id].forEach(async (customerId) => {
        await lineClient.addCustomerToLine(lineWithTwoCustomers.id, customerId);
      });

      const lineWithOneCustomer = await lineClient.create({});
      await lineClient.addCustomerToLine(lineWithOneCustomer.id, customer3.id);

      const lineWithNoCustomers = await lineClient.create({});

      const lines = await lineClient.list({
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
      const customer1 = await customerClient.create({});
      const customer2 = await customerClient.create({});
      const customer3 = await customerClient.create({});

      const lineWithTwoCustomers = await lineClient.create({});
      [customer1.id, customer2.id].forEach(async (customerId) => {
        await lineClient.addCustomerToLine(lineWithTwoCustomers.id, customerId);
      });

      const lineWithOneCustomer = await lineClient.create({});
      await lineClient.addCustomerToLine(lineWithOneCustomer.id, customer3.id);

      const lineWithNoCustomers = await lineClient.create({});

      const lines = await lineClient.list({
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
      it("returns cashier if correct ID is provided", async () => {
        const cashierId = uuidv4();
        const line = await lineClient.create({ cashierId });

        const lines = await lineClient.list({ filters: { cashierId } });
        expect(lines).toHaveLength(1);

        expect(lines[0]).toMatchObject({ cashierId });
      });

      it("returns nothing if incorrect ID is provided", async () => {
        const cashierId = uuidv4();
        const line = await lineClient.create({ cashierId });

        // Pass a different ID
        const lines = await lineClient.list({
          filters: { cashierId: uuidv4() },
        });
        expect(lines).toHaveLength(0);
      });

      it("allows filtering by no cashiers", async () => {
        const line = await lineClient.create({}); // create line without cashier
        const lines = await lineClient.list({
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
      const line = await lineClient.create({ cashierId });
      const customer = await customerClient.create({});
      const customerInLine = await lineClient.addCustomerToLine(line.id, customer.id);

      expect(customerInLine).toEqual({ lineId: line.id, customer });
    });

    it("add customers to the line object", async () => {
      const cashierId = uuidv4();
      let line = await lineClient.create({ cashierId });

      const customer = await customerClient.create({});
      const customerInLine = await lineClient.addCustomerToLine(line.id, customer.id);

      line = (await lineClient.get(line.id))!;
      expect(line.customersInLine).toEqual([customerInLine]);
    });

    it("removes customers from the line", async () => {
      const cashierId = uuidv4();
      const line = await lineClient.create({ cashierId });

      const customer = await customerClient.create({});
      const customerInLine = await lineClient.addCustomerToLine(line.id, customer.id);

      const anotherCustomer = await customerClient.create({});
      const anotherCustomerInLine = await lineClient.addCustomerToLine(line.id, anotherCustomer.id);

      await lineClient.removeCustomerFromLine(line.id, customer.id);

      const customersInLine = await lineClient.getCustomersInLine(line.id);
      expect(customersInLine).not.toContainEqual(customerInLine);

      expect(customersInLine).toContainEqual(anotherCustomerInLine);
    });

    it("gets emptiest line", async () => {
      const customer1 = await customerClient.create({});
      const customer2 = await customerClient.create({});
      const customer3 = await customerClient.create({});

      const lineWithTwoCustomers = await lineClient.create({});
      [customer1.id, customer2.id].forEach(async (customerId) => {
        await lineClient.addCustomerToLine(lineWithTwoCustomers.id, customerId);
      });

      const lineWithOneCustomer = await lineClient.create({});
      await lineClient.addCustomerToLine(lineWithOneCustomer.id, customer3.id);

      const lineWithNoCustomers = await lineClient.create({});

      const emptiestLine = await lineClient.getEmptiestLine();
      expect(emptiestLine).toMatchObject(lineWithNoCustomers);
    });
  });

  describe("cashier", () => {
    it("adds cashier to the line", async () => {
      const cashierId = uuidv4();
      const line = await lineClient.create({});

      const updatedLine = await lineClient.addCashierToLine(line.id, cashierId);

      expect(updatedLine).not.toBeUndefined();
      expect(updatedLine!.cashierId).toBe(cashierId);
    });

    it("removes cashier from the line", async () => {
      const cashierId = uuidv4();
      const line = await lineClient.create({ cashierId });

      const lineWithCashierRemoved = await lineClient.removeCashierFromLine(line.id, cashierId);
      expect(lineWithCashierRemoved).not.toBeUndefined();
      expect(lineWithCashierRemoved!.cashierId).toBeUndefined();
    });
  });
});
