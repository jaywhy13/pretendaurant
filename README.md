# Pretendaurant

A pretend-restaurant that's on its way to using Reinforcement Learning to manage the staff of the restaurant.

I'm doing more detailed documentation on the project itself [here](./docs/developer.md).

## Todos

- [x] Move ID generation to the `LineService`.
- [x] Make `LineService` look like an actual service, `addCustomerToLine` takes a line ID.
- [x] Remove the local service layer abstraction
- [x] Add tests for the clients
- [x] Get the application working again
  - [x] Enable listing of customers in the line (add restaurant state for customers in line, populate it when customers are generated)
  - [x]  Change `Line` to store the customers in the line.
  - [x]  Nested `customer` under `CustomerInLine` object.
- [x] Separate service interfaces from the ones used by the UI layer.
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
    - [x] Get rid of selectors
    - [x] Remove the Provider from index.ts
    - [x] Remove Store
    - [x] Remove Redux tooling from packages
- [x] Add some tests for the engine
  -  [x] Line generation
  -  [x] Cashier generation
  -  [x] Assigning customers to lines
  -  [x] Remove customers from the queue
- [x] Make service calls async. 
  -  [x] Customer
  -  [x] Engine
  -  [x] Fulfillment
  -  [x] Line
  -  [x] Queue
- [ ] The manager should make the following decisions using a random selection algorithm:
    - [ ] Nothing
    - [ ] Change a cashier
- [ ] The following formula should be used to calculate the manager score:
    - 100 - percentage of angry customers - percentage of abandoned customers (minimum of zero)
- [ ] The manager is given feedback after 20 units of time.
- [ ] The score should be displayed prominently.
- [ ] Implement a smarter decision making algorithm based on a poor man's version of Reinforcement Learning.
- [ ] Cashiers can serve a _maximum_ of `speed` number of customers per unit time.
- [ ] Move clients to a backend service
- [ ] Implement push layer for publishing changes to the underlying models.
- [ ] Implement a nice abstraction for using the clock that automatically removes listeners when the at test completion. This should avoid the engine processing another tick due to Jest flushing timers
- [ ] Look into frontend integrations for better Observability

https://stackoverflow.com/questions/52177631/jest-timer-and-promise-dont-work-well-settimeout-and-async-function


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
