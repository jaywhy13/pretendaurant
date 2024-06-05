import { ClockClient } from "../Clock";
import { advanceClockByTicks } from "./utils";

describe("Clock", () => {
  let clockClient: ClockClient;
  const tickRateMs = 1000;

  beforeEach(() => {
    clockClient = new ClockClient(tickRateMs);
  });

  describe("start", () => {
    it("should call the provided callback after a tick", () => {
      const callback = jest.fn();
      expect(callback).not.toHaveBeenCalled();

      clockClient.addOnTickCallback(callback);
      clockClient.start();

      advanceClockByTicks(clockClient, 1);

      expect(callback).toHaveBeenCalled();
    });

    it("should call the provided callback for subsequent ticks", () => {
      const callback = jest.fn();
      expect(callback).not.toHaveBeenCalled();

      clockClient.addOnTickCallback(callback);

      clockClient.start();
      expect(callback).toHaveBeenCalledTimes(1);

      advanceClockByTicks(clockClient, 1);
      expect(callback).toHaveBeenCalledTimes(2);

      advanceClockByTicks(clockClient, 1);
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });
});
