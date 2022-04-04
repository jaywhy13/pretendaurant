import { useSelector } from 'react-redux';
import './App.css';
import { Clock } from './components/Clock';
import { CustomerInLine } from './components/CustomerInLine';

function App() {
  const lines = useSelector(selectLines);
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
    </div>
  );
}

export default App;
