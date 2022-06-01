# Advancing the clock in tests

## Status

✅ Accepted

## Context

The clock is an integral component for the functioning of Pretendaurant. Event occurrence in real time is controlled by the clock's tick rate. A crucial requirement for tests is manipulation of the clock.

Since we won't be using real sleep and timeout methods in our tests, we need utilities that allow us to move the clock forward or pause it.

### Use jest.useFakeTimers and jest.advanceTimersByTime in tests

In this approach, each test that needs to manipulate the clock directly calls jest.useFakerTimers at the start of each test, then jest.advanceTimersByTime to manipulate the clock.

**Pros**
-   This approach is simple and intuitive. Required tests can simply call the different Jest methods.

**Cons**
-   This couples each test to Jest's APIs. All our tests now become susceptible to changes in the Jest API. If Jest changes how their API works, we will end up having to re-work several tests.
-   There is latent complexity due to the differing levels of abstractions. We have to use the `Clock` API and Jest API in tandem.
-   This approach also breaks the `Clock` abstraction of ticks. In order to advance the clock, the test has to convert ticks to seconds.
-   We need to remember to enable fake timers before running the tests, then run pending timers before disabling fake timers after test execution.

### Provide Clock APIs for advancing the clock and automatically use fake timers

In this approach, we automatically set up fake timers. It's improbable we'll have multiple use cases where we need real timers. Real timers aren't typically needed in tests as they slow down our tests. Secondly, we provide an API for advancing the clock by _ticks_.

**Pros**
-   This approach protects tests from being coupled to the Jest API.
-   Allowing tests to manipulate the clock using ticks maintains the abstraction between ticks and real time. Any changes to how this conversion logic works won't affect the tests.
-   Prevents flaky and other oddities caused by possibility of using real timers in tests.

**Cons**
N/A


## Decision
I've decided to go with providing a Clock API for advancing the clocks and automatically using faker timers. The breaking of the clock/tick abstraction is one that will likely bite us in the future. Manipulation of the clock will likely dominate much of testing code for the engine. We want to ensure that the manipulation API is very stable therefore, but also easy to change. Since our tests are volatile, the depedence on the manipulation API will make the manipulation API difficult to change. Therefore, it's useful to introduce an abstraction here to increase the stability of the API.

## Consequences

N/A