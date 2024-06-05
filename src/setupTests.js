// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Disable the use of real timers in tests
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  /**
   * Run pending timers before returning to real timers. This ensures that
   * queued timers get executed. Otherwise, they won't run and there may be
   * unexpected results. This is mostly required for third-party libraries
   * that schedule code we're unaware of.
   *
   * See more about this suggestion here:
   * https://testing-library.com/docs/using-fake-timers/
   */
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
