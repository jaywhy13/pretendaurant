import { useSelector } from 'react-redux';
import './App.css';
import { Clock } from './components/Clock';
import { CustomerInLine } from './components/CustomerInLine';
import { selectCustomersWaitingToJoinLine, selectLines } from './features/restaurant/selectors';

function App() {
  const lines = useSelector(selectLines);
  const customersWaitingToJoinLine = useSelector(selectCustomersWaitingToJoinLine);
  return (
    <div className="App">
      <Clock />
      Everything will go here

      <div>Lines
        {lines.map((line) => (
          <div key={line.id}>
            <b>line {line.id}</b>
            {line.customers.map((customer) => (
              <CustomerInLine customer={customer} />
            ))}
          </div>
        ))}
      </div>

      <div>
        {customersWaitingToJoinLine.length} waiting customers
      </div>
    </div>
  );
}

export default App;
