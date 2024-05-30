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
- [ ] 1.5 - Separate service interfaces from the ones used by the UI layer.
- [ ] 1.6 - Make service calls async.
- [ ] 1.7 - Implement push layer for publishing changes to the underlying models.



## Lessons

- I ran into the `TypeError: Cannot add property 0, object is not extensible` error. I'm guessing this is because I'm using the same types passed back from the service in state.
- The service calls should not have been sychronous.
- The middlewares should not be calling the services to create data. The engine should operate outside of the UI and the UI should just be concerned with rendering the current state of the data.
- I needed to stop making mutations in the middlewares (e.g. removing the customer from the waiting queue). The services should implement that functionality and the middleware should just be updating state from those changes.
- The middlewares were using the same interfaces from the services. There was no indirection introduced. This created problems when I realized I needed to change the shape of the line model. I should have really called those models or remote interfaces or something. I needed to store the time customers entered the line so we could calculate the time they've been waiting in line.
- I was thinking of changing the calls between services and clients. The service is meant to be local abstraction over the underlying client. I'm not sure about the value the "service" abstraction provides though. The client currently does a great job of abstracting the underlying mechanism for retrieving data on customers, cashiers, etc... Do we need a service layer? If we're keeping the client layer and ditching the service layer, it needs to return local types, instead of remote ones. This will make the client's internal mechanisms fungible.
- We're always flying blind without tests. After writing the tests I was able to catch a few bugs:
    - In the `CashierClient` I was storing the mapping outside of the class, so there was actually _one_ global store for all cashiers, instead of one per instance of the class.