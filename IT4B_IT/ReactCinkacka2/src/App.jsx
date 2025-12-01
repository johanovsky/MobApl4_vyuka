import { useEffect, useState } from 'react'
import './App.css'
import Slot from './Slot'

function App() {

  const min = 1;
  const max = 10;

  //pocet kliknuti na tlacitko - signal z App do Slotu aby znovu generoval
  const [spinCount, setSpinCount] = useState(0);
  //pole pro stazene hodnoty ze slotu
  const [slotValues, setSlotValues] = useState([0, 0, 0]);
  //vysledek hry
  const [result, setResult] = useState("");

  function tocime() {
    setSpinCount(spinCount + 1);
  }

  function stahniHodnotyZeSlotu(index, value) {
    setSlotValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  }

  useEffect(() => {
    if((slotValues[0] > 0) && (slotValues[1] > 0) && (slotValues[2] > 0)) {
      //vyhodnoceni
      if((slotValues[0] === slotValues[1]) && (slotValues[1] === slotValues[2])) {
        //TRIPLE
        setResult("TRIPLE");
      } else if((slotValues[0] === slotValues[1]) || 
                (slotValues[1] === slotValues[2]) ||
                (slotValues[0] === slotValues[2])
              ) {
                //DOUBLE
                setResult("DOUBLE");
      } else {
        //LOST
        setResult("LOST");
      }
    }
  }, [slotValues]);

  return (
    <div>
      <h1>React Cinkacka 2</h1>
      <div id="SlotMachine">
        <Slot min={min} max={max} novaTocka={spinCount} funkceProVraceniHodnoty={(v) => stahniHodnotyZeSlotu(0, v)} />
        <Slot min={min} max={max} novaTocka={spinCount} funkceProVraceniHodnoty={(v) => stahniHodnotyZeSlotu(1, v)} />
        <Slot min={min} max={max} novaTocka={spinCount} funkceProVraceniHodnoty={(v) => stahniHodnotyZeSlotu(2, v)} />
      </div>
      <button 
        onClick={tocime}
      >
        TOČIT
      </button>
      <div id="result">
        <h3>{result}</h3>
      </div>
    </div>
  )
}

export default App
