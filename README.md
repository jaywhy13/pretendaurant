# Pretendaurant

A pretend-restaurant that's on its way to using Reinforcement Learning to manage the staff of the restaurant.

## Requirements

### Phase 1

- [x] The restaurant should see a random set of customers coming in consistenly throughout the day.
- [x] Customers should join the emptiest line.
- [ ] Cashiers should serve customers at the front of the line. After customers are served they should leave. Cashiers can serve `speed` number of customers for each unit of time.
- [ ] Customers should leave the restaurant `patience` units of time after joining the line if they are not served.
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

## Notes

- How would things change if we were using a remote service in terms of the data types we're passing around?
- If we want instant updates, we can't check the state. The state is updated sometime after the actions are dispatched and reduced.

## Changes

- Move ID generation to the `LineService`.
- Made `LineService` look like an actual service, `addCustomerToLine` takes a line ID.


## Lessons

- I ran into the `TypeError: Cannot add property 0, object is not extensible` error. I'm guessing this is because I'm using the same types passed back from the service in state.
