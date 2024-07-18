import React, { useEffect } from "react";
import { ClockClient } from "../clients/Clock";

interface IProps {
  clockClient: ClockClient
}

const calculateHoursFromTimeElapsed = (timeElapsed: number) => Math.floor(timeElapsed / 60);
const calculateMinutesFromTimeElapsed = (timeElapsed: number) =>
  timeElapsed - calculateHoursFromTimeElapsed(timeElapsed) * 60;

interface ClockState {
  timeElapsed: number;
  hour: number;
  minutes: number;
}


const formatTimeComponent = (component: number): string => {
  return component.toString().padStart(2, "0");
};

export const ClockComponent: React.FC<IProps> = ({ clockClient }) => {

  const initialState: ClockState = {
    timeElapsed: 0,
    hour: 0,
    minutes: 0,
  };
  const [time, setTime] = React.useState<ClockState>(initialState);
  const { hour, minutes } = time;

  // Update our state when the time changes
  useEffect(() => {
    clockClient.addOnTickCallback(async (timeElapsed: number) => {
      setTime({
        timeElapsed,
        hour: calculateHoursFromTimeElapsed(timeElapsed),
        minutes: calculateMinutesFromTimeElapsed(timeElapsed),
      });
    })


  }, [clockClient]) // the empty array means this effect will only run once


  return (
    <div>
      Time: {formatTimeComponent(hour)}:{formatTimeComponent(minutes)}
    </div>
  );
};
