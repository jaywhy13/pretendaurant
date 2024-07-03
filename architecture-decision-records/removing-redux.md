# Removing Redux


## Status

✅ Accepted

## Context

I've found that using the Redux toolkit has required too much cognitive overhead for me. Additionally,
it gets in the way of the goals I want to achieve. I noticed I'd end up spending more time to figure
out how to get certain things done in Redux that I could have avoided if used React state instead.

The straw that broke the camel's back was implementing async behaviour in the middleware. I was
previously using the middleware to implement functionality in the Engine. I wanted to make
all the middleware calls async because I was making all the client calls async.

Finding out how to get that done was time consuming and I wasn't turning up viable options.
The primary goal of this project is architectural experimentation and learning. I don't want
to spend time on things that don't achieve my goals. Getting better at Redux toolkit would 
likely provide some interesting lessons, however, I don't want to spend time on that right now.
Also, not at the cost of sacrificing time on other things that I want to learn.

### Remove Redux

Removing Redux is an attractive option because it significantly reduces the complexity of the project.
Redux does provide dispatching functionality for eventing however. This is why Redux was chosen
in the first place. I can eventually replace that eventing with something else.

### Investigate async in Redux

I could also investigate how to get async behaviour in Redux. This would be a good learning
about the async functionality in Javascript and Redux. However, this isn't valuable to me
right now, and its also misaligned with my primary goals.

## Decision

Remove Redux


## Consequences

As a result, we'll need to find another eventing framework when we get there.
