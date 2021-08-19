import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux'
import clockReducer from './features/clock/clockSlice';
import engineReducer from './features/engine/engineSlice';
import restarauntReducer from './features/restaraunt/restarauntSlice';
import { customerGenerationMiddleware, lineGenerationMiddleware } from './features/engine/middleware';
import { addCustomerToLineMiddleware, addCustomerToQueueMiddleware, lineSetupMiddleware } from './features/restaraunt/middleware';


const loggingMiddleware: Middleware = ({ getState }) => {
    return next => action => {
        console.log("will dispatch action", action);
        return next(action);
    }
}

const store = configureStore({
    reducer: {
        engine: engineReducer,
        clock: clockReducer,
        restaraunt: restarauntReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(
        customerGenerationMiddleware,
        lineGenerationMiddleware,
        addCustomerToQueueMiddleware,
        lineSetupMiddleware,
        addCustomerToLineMiddleware,
        loggingMiddleware
    )
});

// store.subscribe(() => console.log("Store state", store.getState()))
export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
export default store;