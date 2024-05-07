# Fetching customers in line 

## Status

✅ Accepted


## Context

We need to determine how to fetch customers in the line. Should the `LineClient` provide
the list of customers in line on the `Line` object, or should there be a separate object
that provides the list of customers in the line?

### Use `Line.customersInLine`

This approach would simplify things for the rest of the application. If
the `LineClient` provides the list of customers in line on the `Line` object,
then the `Line` object can be passed around and the list of customers in line.
This is most in line with our business logic and requirements. 

**Pros**
- Simplifies access for the rest of the app. We can just pass around the `Line` object
without having to worry about fetching the customers in line.
- The logic for including customers in line is centralized.

**Cons**
- This could result in over fetching. Each time we need customers in line, we may need to also fetch line details.
- In the long term, a `list` endpoint could quickly become non-performant due to multiple calls to other nested resources. Although, we should only have a small number of customers in line at any given time. 

### Use a separate object (`CustomersInLine`)

**Pros**
- It cleanly separates the customers in the line, from the `Line` itself. This simplifies
the work of the `LineClient`. 
- Simplicity in the API. The `LineClient` only needs to worry about the `Line` object.

**Cons**
- Requires more work in the application to sticth the pieces of data together.

## Decision

I've decided to go with adding the `customersInLine` to the `Line` object. This will simplify
things greatly for the application and better align with our requirements.

## Consequences

- Pagination - if we need to paginate the customers in line, we may need to add additional
fields to the `Line` object to support this.

