import { useState } from 'react'
import './App.css'

function App() {

  function zavibruj(time) {
    return ()=> {
      //test zda zarizeni vibrace podporuje
      if("vibrate" in navigator) {
        //ano, vibrace jsou podporovany -> spustime je
        //ocekava delku vibrace v ms
        navigator.vibrate(time);
      } else {
        //vibrace nejsou podporovany
        alert("Vibrace nejsou podporovany");
      }
    }
  }

  function zavibrujSOS() {
    //test zda zarizeni vibrace podporuje
    if("vibrate" in navigator) {
      //ano, vibrace jsou podporovany -> spustime je
      //ocekava delku vibrace v ms, delku pauzy v ms, ...
      navigator.vibrate([200, 200, 200, 200, 200, 200, 500, 200, 500, 200, 500, 200, 200, 200, 200, 200, 200]);
    } else {
      //vibrace nejsou podporovany
      alert("Vibrace nejsou podporovany");
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
    </div>
  )
}

export default App
