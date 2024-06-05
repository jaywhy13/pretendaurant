import { ClockClient } from "../Clock";

export const advanceClockByTicks = (clockClient: ClockClient, ticks: number) => {
  const tickRateMs = clockClient.getTickRateMs();
  const actualTimeMs = tickRateMs * ticks;
  jest.advanceTimersByTime(actualTimeMs);
};
