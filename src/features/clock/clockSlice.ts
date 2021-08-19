import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const calculateHoursFromTimeElapsed = (timeElapsed: number) => Math.floor(timeElapsed / 60);
const calculateMinutesFromTimeElapsed = (timeElapsed: number) => timeElapsed - (calculateHoursFromTimeElapsed(timeElapsed) * 60);

interface ClockState {
    timeElapsed: number;
    hour: number;
    minutes: number;
}

const initialState: ClockState = {
    timeElapsed: 0,
    hour: 0,
    minutes: 0
};

export const clockSlice = createSlice({
    name: 'clock',
    initialState,
    reducers: {
        timeElapsed: (state, action: PayloadAction<number>) => {
            state.timeElapsed += action.payload;
            state.hour = calculateHoursFromTimeElapsed(state.timeElapsed);
            state.minutes = calculateMinutesFromTimeElapsed(state.timeElapsed);
        },
        timeStarted: () => { },
    }
})

export const selectTimeElapsed = (state: RootState) => state.clock.timeElapsed;

export const selectTime = (state: RootState) => ({ hour: state.clock.hour, minutes: state.clock.minutes });

export const { timeStarted, timeElapsed } = clockSlice.actions;

export default clockSlice.reducer;