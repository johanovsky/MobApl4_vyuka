import { useEffect, useState } from 'react'
import './Slot.css'

function Slot({ min, max, novaTocka, funkceProVraceniHodnoty }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    //vygenerovani nove hodnoty
    const newValue = Math.floor(Math.random() * (max - min + 1)) + min;
    //ulozime si ji ve slotu
    setValue(newValue);
    //posleme ji zpet App
    if(funkceProVraceniHodnoty) {
        funkceProVraceniHodnoty(newValue);
    }
  }, [novaTocka]);

  return (
    <div id="slot">
        {value}
    </div>
  )
}

export default Slot