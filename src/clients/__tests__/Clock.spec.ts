import { ClockClient } from "../Clock";
import { FakeClockClient } from "./FakeClockClient";


describe("Clock", () => {
  let clockClient: FakeClockClient;
  const tickRateMs = 1000;

  beforeEach(() => {
    clockClient = new FakeClockClient(tickRateMs);
  });

  describe("start", () => {
    it("should call the provided callback after a tick", async () => {
      const callback = jest.fn();
      expect(callback).not.toHaveBeenCalled();

      clockClient.addOnTickCallback(callback);
      await clockClient.start();

      await clockClient.advanceByTicks(1);

      expect(callback).toHaveBeenCalled();
    });

    it("should call the provided callback for subsequent ticks", async () => {
      const callback = jest.fn();
      expect(callback).not.toHaveBeenCalled();

      clockClient.addOnTickCallback(callback);

      await clockClient.start();
      expect(callback).toHaveBeenCalledTimes(1);

      await clockClient.advanceByTicks(1);

      expect(callback).toHaveBeenCalledTimes(2);

      await clockClient.advanceByTicks(1);
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });
});
