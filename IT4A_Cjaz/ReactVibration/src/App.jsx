import { useState } from 'react'
import './App.css'

function App() {

  const [delkaVibrace, setDelkaVibrace] = useState(100);

  /*
  function zavibruj() {
    if("vibrate" in navigator) {
      //ano zarizeni podporuje vibrace
      //delka vibrace je v ms
      navigator.vibrate(500);
    } else {
      //zarizeni je nepodporuje
      alert("Vibrace nejsou na zarizeni podporovany");
    }
  }
  */

  //funkce vyse jen prepsana na funkci ktera vraci funkci
  function zavibruj(time) {
    return () => {
      if("vibrate" in navigator) {
        //ano zarizeni podporuje vibrace
        //delka vibrace je v ms
        navigator.vibrate(time);
      } else {
        //zarizeni je nepodporuje
        alert("Vibrace nejsou na zarizeni podporovany");
      }
    }
  }

  function zavibrujSOS() {
    if("vibrate" in navigator) {
      //ano zarizeni podporuje vibrace
      //poradi je vibrace, pauza, vibrace, pauza ...
      navigator.vibrate([250, 250, 250, 250, 250, 250, 500, 250, 500, 250, 500, 250, 250, 250, 250, 250, 250]);
    } else {
      //zarizeni je nepodporuje
      alert("Vibrace nejsou na zarizeni podporovany");
    }
  }

  return (
    <div>
      <h1>React Vibration</h1>
      <button onClick={zavibruj(200)}>
        krátká vibrace
      </button>
      <button onClick={zavibruj(1000)}>
        dlouhá vibrace
      </button>
      <button onClick={zavibrujSOS}>
        SOS
      </button>
      <label>
        Délka vibrace: {delkaVibrace}ms
      </label>
      <input 
        type="range"
        min="100"
        max="5000"
        value={delkaVibrace}
        onChange={(e) => setDelkaVibrace(Number(e.target.value))}
      />
      <button onClick={zavibruj(delkaVibrace)}>
        uživatelská vibrace
      </button>
    </div>
  )
}

export default App
