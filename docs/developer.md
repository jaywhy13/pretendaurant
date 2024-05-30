# Project Structure

## Overview

This project is built using React and Redux for state management. I'm using the Redux Toolkit
specifically which provides some additional abstractions over the base Redux library.

In particular, I'm using the concept of "slices" to manage the state of the application. It
also reduces some of the boilerplate required to generate actions and reducers.

A slice organizes the state, reducers and actions for a part of our application. 

So far we've got two slices:

- Engine Slice - this stores all the state related to the simulation of the restaurant.
- Restaurant Slice - this stores all the state related to the restaurant itself.


