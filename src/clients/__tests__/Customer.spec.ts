import { CustomerClient } from "../Customer";

describe("Customer client", () => {
  let customerClient: CustomerClient;

  beforeEach(() => {
    customerClient = new CustomerClient();
  });

  describe("create", () => {
    it("should create an ID for the customer", async () => {
      const customer = await customerClient.create({ patience: 10 });
      expect(customer.id).toBeTruthy();
    });

    it("should create the attributes on the customer", async () => {
      const customer = await customerClient.create({ patience: 10 });
      expect(customer.patience).toEqual(10);
    });
  });

  describe("get", () => {
    it("should get existing customer", async () => {
      const customer = await customerClient.create({ patience: 10 });
      expect(await customerClient.get(customer.id)).toEqual(customer);
    });

    it("should return undefined for non-existent customer", async () => {
      expect(await customerClient.get("abcdef")).toBeUndefined();
    });
  });

  describe("list", () => {
    it("should list existing customers", async () => {
      const customer = await customerClient.create({ patience: 10 });
      expect(await customerClient.list()).toEqual([customer]);
    });
  });

  describe("update", () => {
    it("should update existing customers", async () => {
      const customer = await customerClient.create({ patience: 10 });
      await customerClient.update(customer.id, { patience: 5 });

      expect((await customerClient.get(customer.id))?.patience).toBe(5);
    });
  });
});
