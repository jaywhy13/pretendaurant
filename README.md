# Pretendaurant

A pretend-restaurant that's on its way to using Reinforcement Learning to manage the staff of the restaurant.

I'm doing more detailed documentation on the project itself [here](./docs/developer.md).

## Requirements

### Phase 1

- [x] The restaurant should see a random set of customers coming in consistenly throughout the day.
- [x] Customers should join the emptiest line.
- [x] Cashiers should serve customers at the front of the line. After customers are served they should leave. Cashiers can serve `speed` number of customers for each unit of time.
- [x] Customers should leave the restaurant `patience` units of time after joining the line if they are not served.
- [ ] The manager should make the following decisions using a random selection algorithm:
    - [ ] Nothing
    - [ ] Change a cashier
- [ ] The following formula should be used to calculate the manager score:
    - 100 - percentage of angry customers - percentage of abandoned customers (minimum of zero)
- [ ] The manager is given feedback after 20 units of time.
- [ ] The score should be displayed prominently.


### Phase 2
- [ ] Implement a smarter decision making algorithm based on a poor man's version of Reinforcement Learning.
- [ ] Cashiers can serve a _maximum_ of `speed` number of customers per unit time.

## Changes

### Phase 1
- [x] 1.1 - Move ID generation to the `LineService`.
- [x] 1.2 - Make `LineService` look like an actual service, `addCustomerToLine` takes a line ID.
- [x] 1.3 - Remove the local service layer abstraction
- [x] 1.4 - Add tests for the clients
- [x] 1.5 - Get the application working again
  - [x] 1.5.1 - Enable listing of customers in the line (add restaurant state for customers in line, populate it when customers are generated)
  - [x] 1.5.2 - Change `Line` to store the customers in the line.
  - [x] 1.5.3 - Nested `customer` under `CustomerInLine` object.
- [x] 1.6 - Separate service interfaces from the ones used by the UI layer.
- [ ] 1.7 - Make service calls async (cashier, clock). 
    -   Having issues trying to implement async Redux middleware.
    -   First... what's a middlewae and how is that different from a thunk?
    -   Actually, before that I need to let the cashier middleware work async
- [x] Remove redux
    Redux is too complicated and learning it isn't very valuable for me. I need to work with a simpler
    - [x] Create Restaurant component
    - [x] Move startClock logic to the Restaurant component
    - [x] Add some logic to refresh the state from the clients (just added a basic refresh for now)
    - [x] Convert slices to plain React state
        - [x] Convert the clock slice to plain React state
        - [x] Convert the engline slice to plain React state
        - [x] Convert the restaurant slice to plain React state
    - [x] Convert middleware to plain React state

    - [ ] Figure out how to replace React dispatch functionality
    - [x] Get rid of selectors
    - [x] Remove the Provider from index.ts
    - [x] Remove Store
    - [x] Remove Redux tooling from packages
 [ ] 1.8 - Implement push layer for publishing changes to the underlying models.
- [ ] 1.9 - Remove business logic from the middleware layer. Perhaps the middleware should only trigger the engine, and the engine should determine what happens.
- [ ] 1.10 - Move selectors into the slice.


## Lessons

- I ran into the `TypeError: Cannot add property 0, object is not extensible` error. I'm guessing this is because I'm using the same types passed back from the service in state.
- The service calls should not have been sychronous.
- The middlewares should not be calling the services to create data. The engine should operate outside of the UI and the UI should just be concerned with rendering the current state of the data.
- I needed to stop making mutations in the middlewares (e.g. removing the customer from the waiting queue). The services should implement that functionality and the middleware should just be updating state from those changes.
- The middlewares were using the same interfaces from the services. There was no indirection introduced. This created problems when I realized I needed to change the shape of the line model. I should have really called those models or remote interfaces or something. I needed to store the time customers entered the line so we could calculate the time they've been waiting in line.
- I was thinking of changing the calls between services and clients. The service is meant to be local abstraction over the underlying client. I'm not sure about the value the "service" abstraction provides though. The client currently does a great job of abstracting the underlying mechanism for retrieving data on customers, cashiers, etc... Do we need a service layer? If we're keeping the client layer and ditching the service layer, it needs to return local types, instead of remote ones. This will make the client's internal mechanisms fungible.
- We're always flying blind without tests. After writing the tests I was able to catch a few bugs:
    - In the `CashierClient` I was storing the mapping outside of the class, so there was actually _one_ global store for all cashiers, instead of one per instance of the class.
- Use tooling only when necessary. Adding Redux at the start was HUGE OVERKILL. Adding Redux Toolkit at the start was even worse! For such a simple app, we don't need something as complex as Redux. When we inherit the complexity, we can re-evaluate whether we need it.
