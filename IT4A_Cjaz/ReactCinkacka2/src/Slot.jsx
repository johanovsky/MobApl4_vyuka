import { useEffect, useState } from 'react'
import './Slot.css'

function Slot({ min, max, spinSignal, onValueChange }) 
{
  
  const [value, setValue] = useState(0);

  //efekt ktery se spousti pri zmene spinSignalu
  useEffect(() => 
  {
    const newValue = Math.floor(Math.random() * (max - min + 1)) + min;
    setValue(newValue);
    if(onValueChange) 
    {
        onValueChange(newValue);
    }
  }, [spinSignal])

  return (
    <>
      <div id="slot">
        {value}
      </div>
    </>
  )
}

export default Slot