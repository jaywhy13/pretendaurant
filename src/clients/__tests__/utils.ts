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
export const advanceClockByTicks = async (clockClient: ClockClient, ticks: number) => {
  const tickRateMs = clockClient.getTickRateMs();
  const actualTimeMs = tickRateMs * ticks;
  jest.advanceTimersByTime(actualTimeMs);

  /**
    * This is necessary to ensure that we process any
    * queued tasks in the microtask queue (e.g. promises)
    * that need to be run.
    * Doing so avoids us running into cases where a method
    * doesn't run to completion because it has an await
    * in it.
    * When there's an await in the method, the rest of the
    * method is queued in the microtask queue, then 
    * Javascript will execute the rest of the test,
    * or whatever calling code there is.
    */
  await flushPromises();
};

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}
