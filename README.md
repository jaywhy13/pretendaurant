# Pretendaurant

A pretend-restaurant that's on its way to using Reinforcement Learning to manage the staff of the restaurant.

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
- [x] Move ID generation to the `LineService`.
- [x] Make `LineService` look like an actual service, `addCustomerToLine` takes a line ID.
- [ ] Separate service interfaces from the ones used by the UI layer.
- [ ] Make service calls async.
- [ ] Implement push layer for publishing changes to the underlying models.



## Lessons

- I ran into the `TypeError: Cannot add property 0, object is not extensible` error. I'm guessing this is because I'm using the same types passed back from the service in state.
- The service calls should not have been sychronous.
- The middlewares should not be calling the services to create data. The engine should operate outside of the UI and the UI should just be concerned with rendering the current state of the data.
- I needed to stop making mutations in the middlewares (e.g. removing the customer from the waiting queue). The services should implement that functionality and the middleware should just be updating state from those changes.
- The middlewares were using the same interfaces from the services. There was no indirection introduced. This created problems when I realized I needed to change the shape of the line model. I should have really called those models or remote interfaces or something. I needed to store the time customers entered the line so we could calculate the time they've been waiting in line.