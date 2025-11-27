import { useEffect, useState } from 'react'
import './App.css'
import Slot from './Slot'

function App() {

  //minimum + maximum pro generovani
  const min = 1;
  const max = 10;
  //tohle budeme posilat do slotu, aby generovaly nove hodnoty
  const [spinCount, setSpinCount] = useState(0);
  //pole vytocenych hodnot
  const [slotValues, setSlotValues] = useState([0, 0, 0]);
  //pro vypis vysledku
  const [result, setResult] = useState("PROHRA :-)");
  
  function zvysSpin() 
  {
    setSpinCount(spinCount+1);
  }

  function stahniHodnoty(index, value) 
  {
    setSlotValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  }

  useEffect(() => {
    //vyhodnocujeme pouze pokud slotValues ma hodnotu jinou nez 0
    if((slotValues[0] > 0) && (slotValues[1] > 0) && (slotValues[2] > 0)) 
    {
      if((slotValues[0] === slotValues[1]) && (slotValues[1] === slotValues[2]))
      {
        setResult("TRIPLE WIN !!!");
      }
      else if
      (
        (slotValues[0] === slotValues[1]) || 
        (slotValues[1] === slotValues[2]) || 
        (slotValues[0] === slotValues[2])
      )
      {
        setResult("DOUBLE WIN !!");
      }
      else 
      {
        setResult("PROHRA :-)");
      }
    }
  }, [slotValues])

  return (
    <div>
      <h1>React Cinkacka 2.0</h1>
      <div>
        <Slot min={min} max={max} spinSignal={spinCount} onValueChange={(v) => stahniHodnoty(0, v)} />
        <Slot min={min} max={max} spinSignal={spinCount} onValueChange={(v) => stahniHodnoty(1, v)} />
        <Slot min={min} max={max} spinSignal={spinCount} onValueChange={(v) => stahniHodnoty(2, v)}/>
      </div>
      <button onClick={zvysSpin}>
        SPIN
      </button>
      <div>
        <h3>{result}</h3>
      </div>
    </div>
  )
}

export default App
