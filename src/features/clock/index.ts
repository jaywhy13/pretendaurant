import { clockClient } from "../../clients/Clock";
import store from "../../store";
import { timeStarted as timeStartedAction, timeElapsed as timeElapsedAction } from "./clockSlice";

export const startClock = () => {
  store.dispatch(timeStartedAction());
  clockClient.start();

  clockClient.addOnTickCallback((timeElapsed: number) => {
    store.dispatch(timeElapsedAction(timeElapsed));
  });
};
