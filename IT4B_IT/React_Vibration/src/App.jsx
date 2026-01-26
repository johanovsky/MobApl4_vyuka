import { useState } from 'react'
import './App.css'

function App() {
  const [delkaVibrace, setDelkaVibrace] = useState(100);

  function zavibruj(time) {
    return ()=> {
      //jestlize jsou v prohlizeci podporovany vibrace
      if("vibrate" in navigator) {
        //doba vybrace v ms
        navigator.vibrate(time);
      } else {
        alert("Vibrace nejsou na zarizeni podporovany");
      }
    }
  }

  function zavibrujSOS() {
    //jestlize jsou v prohlizeci podporovany vibrace
    if("vibrate" in navigator) {
      //doba vybrace v ms, poradi [vibrace, mezera, atd...]      
      navigator.vibrate([200, 200, 200, 200, 200, 200, 
        1000, 200, 1000, 200, 1000, 200, 
        200, 200, 200, 200, 200]);
    } else {
      alert("Vibrace nejsou na zarizeni podporovany");
    }
  }

  return (
    <div>
      <h1>React vibration</h1>
      <button onClick={zavibruj(200)}>Zavibruj krátce</button>
      <button onClick={zavibruj(1000)}>Zavibruj dlouze</button>
      <button onClick={zavibrujSOS}>SOS</button>
      <label>
        Délka vibrace: {delkaVibrace}ms
      </label>
      <input
        type="range"
        min="100"
        max="5000"
        value={delkaVibrace}
        onChange={(e) => setDelkaVibrace(e.target.value)}
      />
      <button onClick={zavibruj(delkaVibrace)}>Zavibruj podle zadani</button>
    </div>
  )
}

export default App
