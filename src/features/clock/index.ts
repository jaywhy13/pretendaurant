import { clockClient } from "../../clients/Clock";
import store from "../../store";
import { timeStarted as timeStartedAction, timeElapsed as timeElapsedAction } from "./clockSlice";

export const startClock = async () => {
  store.dispatch(timeStartedAction());
  await clockClient.start();

  clockClient.addOnTickCallback(async (timeElapsed: number) => {
    store.dispatch(timeElapsedAction(timeElapsed));
  });
};
