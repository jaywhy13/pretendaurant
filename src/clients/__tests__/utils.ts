import { ClockClient } from "../Clock";

/**
 * Advances the clock by the given number of ticks.
 * This depends on Jest's fake timers. In our Jest
 * setup file we call jest.useFakeTimers() to disable
 * the use of real timers.
 * This enables us to use the jest.advanceTimersByTime()
 * function to advance the clock by a given number of
 * ticks.
 *
 * @param clockClient The clock client to advance.
 * @param ticks The number of ticks to advance the clock by.
 * @returns void
*/
export const advanceClockByTicks = (clockClient: ClockClient, ticks: number) => {
  const tickRateMs = clockClient.getTickRateMs();
  const actualTimeMs = tickRateMs * ticks;
  jest.advanceTimersByTime(actualTimeMs);
};
