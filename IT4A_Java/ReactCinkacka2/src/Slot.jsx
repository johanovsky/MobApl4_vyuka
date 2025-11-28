import { useEffect, useState } from 'react'
import './Slot.css'

function Slot({ min, max, spinSignal, vratHodnotu}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    //kdyz se zmeni spinSignal -> generuj nove cislo
    const newValue = Math.floor(Math.random() * (max - min + 1)) + min;
    setValue(newValue);
    if(vratHodnotu) {
        //mam funkci kam budu vracet hodnotu
        vratHodnotu(newValue);
    }
  }, [spinSignal]);

  return (
    <div id="slot">
        {value}
    </div>
  )
}

export default Slot
