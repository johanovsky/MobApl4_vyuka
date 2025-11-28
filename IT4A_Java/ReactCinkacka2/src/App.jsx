import { useEffect, useState } from 'react'
import './App.css'
import Slot from './Slot';

function App() {
  const min = 1;
  const max = 2;

  //spinCount pro komunikaci se sloty
  const [spinCount, setSpinCount] = useState(0);
  //pole pro stazene hodnoty z slotu
  const [slotValues, setSlotValues] = useState([0, 0, 0]);
  //string s vysledkem
  const [result, setResult] = useState("");

  function nextSpin() {
    setSpinCount(spinCount + 1);
  }

  function stahniHodnotuDoPole(index, value) {
    setSlotValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  }

  useEffect(() => {
    if((slotValues[0] === slotValues[1]) && (slotValues[1] === slotValues[2])) {
      //TRIPLE
      setResult("TRIPLE");
    } else if(
      (slotValues[0] === slotValues[1]) || 
      (slotValues[1] === slotValues[2]) || 
      (slotValues[0] === slotValues[2])
      ) {
      //DOUBLE
      setResult("DOUBLE");
    } else {
      //LOST
      setResult("LOST");
    }
  }, [slotValues]);

  return (
    <div>
      <h1>React Cinkacka 2.0</h1>
      <div id="slotMachine">
        <Slot min={min} max={max} spinSignal={spinCount} vratHodnotu={(v) => stahniHodnotuDoPole(0, v)} />
        <Slot min={min} max={max} spinSignal={spinCount} vratHodnotu={(v) => stahniHodnotuDoPole(1, v)} />
        <Slot min={min} max={max} spinSignal={spinCount} vratHodnotu={(v) => stahniHodnotuDoPole(2, v)} />
      </div>
      <button 
        onClick={nextSpin}
      >
        SPIN
      </button>
      <div>
        <h3>{result}</h3>
      </div>
    </div>
  )
}

export default App
