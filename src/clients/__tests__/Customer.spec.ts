import { CustomerClient } from "../Customer";

describe("Customer client", () => {
  let customerClient: CustomerClient;

  beforeEach(() => {
    customerClient = new CustomerClient();
  });

  describe("create", () => {
    it("should create an ID for the customer", () => {
      const customer = customerClient.create({ patience: 10 });
      expect(customer.id).toBeTruthy();
    });

    it("should create the attributes on the customer", () => {
      const customer = customerClient.create({ patience: 10 });
      expect(customer.patience).toEqual(10);
    });
  });

  describe("get", () => {
    it("should get existing customer", () => {
      const customer = customerClient.create({ patience: 10 });
      expect(customerClient.get(customer.id)).toEqual(customer);
    });

    it("should return undefined for non-existent customer", () => {
      expect(customerClient.get("abcdef")).toBeUndefined();
    });
  });

  describe("list", () => {
    it("should list existing customers", () => {
      const customer = customerClient.create({ patience: 10 });
      expect(customerClient.list()).toEqual([customer]);
    });
  });

  describe("update", () => {
    it("should update existing customers", () => {
      const customer = customerClient.create({ patience: 10 });
      customerClient.update(customer.id, { patience: 5 });

      expect(customerClient.get(customer.id)?.patience).toBe(5);
    });
  });
});
