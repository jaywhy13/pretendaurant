import { useEffect } from "react";
import "./App.css";
import { CashierClient } from "./clients/Cashier";
import { ClockClient } from "./clients/Clock";
import { CustomerClient } from "./clients/Customer";
import { EngineClient, EngineOptions } from "./clients/Engine";
import { LineClient } from "./clients/Line";
import { QueueClient } from "./clients/Queue";
import RestaurantComponent from "./components/RestaurantComponent";

function App() {
  const clockClient = new ClockClient();
  const customerClient = new CustomerClient();
  const lineClient = new LineClient(customerClient);
  const cashierClient = new CashierClient();
  const queueClient = new QueueClient();
  const options: EngineOptions = {
    numberOfLines: 4,
    numberOfCashiers: 4,
    numberOfCustomersToGenerate: 2,
    numberOfTicksBetweenCustomerGeneration: 4,
    numberOfTicksBetweenAssigningCustomersToLines: 4,
  };
  const engineClient = new EngineClient({
    lineClient,
    customerClient,
    cashierClient,
    clockClient,
    queueClient,
    options,
  });

  return (
    <div className="App">
      <RestaurantComponent clockClient={clockClient} lineClient={lineClient} />
    </div>
  );
}

export default App;
