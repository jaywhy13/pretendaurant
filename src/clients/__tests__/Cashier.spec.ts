import { CashierClient } from "../Cashier";
import { getRandomInt } from "./factories";

describe("Cashier", () => {
  let cashierClient: CashierClient;

  beforeEach(() => {
    cashierClient = new CashierClient();
  });

  describe("create", () => {
    it("should create cashiers with supplied attributes", async () => {
      const speed = getRandomInt(10);
      const cashier = await cashierClient.create(speed);
      expect(cashier.speed).toBe(speed);
    });
  });

  describe("list", () => {
    it("should list existing cashiers", async () => {
      const speed = getRandomInt(10);
      const cashier = await cashierClient.create(speed);
      expect(await cashierClient.list()).toEqual([cashier]);
    });
  });

  describe("get", () => {
    it("should get existing cashier", async () => {
      const speed = getRandomInt(10);
      const cashier = await cashierClient.create(speed);
      expect(await cashierClient.get(cashier.id)).toEqual(cashier);
    });

    it("should return undefined for non-existent cashier", async () => {
      expect(await cashierClient.get("abcdef")).toBeUndefined();
    });
  });

  describe("update", () => {
    it("should update existing cashier", async () => {
      const speed = 2;
      let cashier = await cashierClient.create(speed);
      await cashierClient.update(cashier.id, { speed: 10 });
      const updatedCashier = await cashierClient.get(cashier.id);
      expect(updatedCashier!.speed).toEqual(10);
    });
  });
});
