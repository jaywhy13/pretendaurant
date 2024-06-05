import { useSelector } from "react-redux";
import "./App.css";
import { Clock } from "./components/Clock";
import { CustomerInLine } from "./components/CustomerInLine";
import { selectLines } from "./features/restaurant/selectors";
import { CustomerInLine as LocalCustomerInLine } from "./types";

function App() {
  const lines = useSelector(selectLines);

  return (
    <div className="App">
      <Clock />
      Everything will go here
      <div>
        Lines
        {lines.map((line) => (
          <div key={line.id}>
            <b>line {line.id}</b>
            {line.cashierId ? <span> w/ cashier - {line.cashierId}</span> : null}
            {line.customersInLine.map(({ customer: { id } }) => (
              <CustomerInLine customerId={id} key={id} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
