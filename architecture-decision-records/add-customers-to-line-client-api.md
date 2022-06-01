# Add Customers to Line Client API

## Status

✅ Accepted

## Context

As part of the normal functioning of the Restaurant, our engine will simulate customers joining lines. In order to simulate this, the engine needs to add customers to the line via the available clients. We need to determine the structure of the API. There are different ideas for the API structure.

### Allow management of customers through line entity

In this approach, the API permits management of customers in the line by mutating the `Line` object. The following sample methods would provide the described functionality:
-   `create(cashierId, customerIds)`
-   `get(lineId)`
-   `list()`
-   `update(lineId, cashierId?, customerIds?)`

**Pros**
-   The consumer requires less knowledge about the internal entity structure. This results in a reduction in complexity.
-   Any attribute update can be supported via `PATCH` type operations.

**Cons**
-   This has latent complexity -- this API allows creation of customers in the `create` and `update` methods. Customers in the line cannot be naively removed, since additional fields are added to the customer when they are placed in the line (e.g. `timeJoined`).
-   This effectively houses a nested resource. Pagination will likely be either complicated, or slightly unnatural. This is especially complex for a `list` method.
-   This approach may result in over fetching. Each time we need customers in line, we may need to also fetch line details.
-   In the long term, a `list` endpoint could quickly become non-performant due to multiple calls to other nested resources.


### Allow management of customers with dedicated entities
In this approach, the API provides a dedicated API for managing customers in a line. The following sample methods would achieve the described functionality:
-   `addCustomerToLine(lineId, customerId)`
-   `getCustomersInLine(lineId)`
-   `removeCustomerFromLine(lineId, customerId)`

**Pros**
-   This API feels natural and intuitive.

**Cons**
-   This could result in some inconsistency if only customers expose a separate API from line management (e.g. cashier).
-   This requires extra network hops to add customers to a line, even though that information may be available at creation time.


## Decision

I've chosen to go with the API with dedicated entities. This approach has the least obvious set of negatives.

## Consequences

Since we're making this decision before the API is being used, it's simple to go either way. I have already implemented methods that are close to the first proposed solution, so those will need to be modified now.
