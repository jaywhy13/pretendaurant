import React, { useEffect, useState } from "react";
import { ClockClient } from "../clients/Clock";
import { EngineClient } from "../clients/Engine";
import { LineClient } from "../clients/Line";
import { CustomerInLine, Line } from "../types";
import { ClockComponent } from "./ClockComponent"
import { CustomerInLineComponent } from "./CustomerInLineComponent";

export interface RestaurantState {
  lines: Line[];
}

interface IProps {
  clockClient: ClockClient;
  lineClient: LineClient;
}

export const Restaurant: React.FC<IProps> = ({ clockClient, lineClient }) => {

  const initialState: RestaurantState = {
    lines: [],
  };

  const [restaurant, setRestaurant] = useState<RestaurantState>(initialState);
  const lines = restaurant.lines;

  const handleClickStart = async () => {
    console.log("Starting the clock")
    await clockClient.start();
    // Previously we call dispatch here. For now,
    // I'm leaving it blank because the EngineClient
    // actually adds its own callback once its initialized
  }

  const handleRefreshData = async () => {
    const lines = lineClient.list();
    setRestaurant({ lines, })
  }

  // Refresh data automatically on each tick
  useEffect(() => {
    clockClient.addOnTickCallback(async () => {
      handleRefreshData();
    });
  }, [])

  return (
    <div className="restaurant">
      <button onClick={handleClickStart}>Start</button>
      <button onClick={handleRefreshData}>Refresh</button>
      < ClockComponent clockClient={clockClient} />
      Everything will go here
      < div >
        Lines
        {
          lines.map((line) => (
            <div key={line.id}>
              <b>line {line.id}</b>
              {line.cashierId ? <span> w/ cashier - {line.cashierId}</span> : null}
              {line.customersInLine.map(({ customer }) => (
                <CustomerInLineComponent customer={customer} key={customer.id} />
              ))}
            </div>
          ))
        }
      </div >
    </div>
  )
}

export default Restaurant; 
