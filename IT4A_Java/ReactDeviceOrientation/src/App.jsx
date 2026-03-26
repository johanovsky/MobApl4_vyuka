import { useEffect, useState } from 'react'
import './App.css'

function App() {

  //useStates pro tri uhly
  const [alpha, setAlpha] = useState(0);
  const [beta,  setBeta]  = useState(0);
  const [gamma, setGamma] = useState(0);

  //useState kvuli prepinani UI - default = senzory off
  const [sensors, setSensors] = useState(false);

  function zmenUhly(event) {
    if(event.alpha !== null) {
      setAlpha(event.alpha);
    } else {
      setAlpha(0);
    }
    setBeta(event.beta ?? 0);
    setGamma(event.gamma ?? 0);
  }

  async function switchSensors() {
    if(sensors === false) {
      //jsou vypnuty, budeme zapinat
      try {
        //povoleni pristupu k device orientation (Ios)
        if((typeof DeviceOrientationEvent !== "undefined") && 
          (typeof DeviceOrientationEvent.requestPermission === "function")) {
            const response = await DeviceOrientationEvent.requestPermission();
            if(response !== "granted") return;
        }

        //samotne cteni ze senzoru (Andr + Ios)
        window.addEventListener("deviceorientation", zmenUhly);

        setSensors(true);
      } catch(err) {
        alert("Senzor error");
      }
    } else {
      //jsou zapnuty, budeme vypinat

      window.removeEventListener("deviceorientation", zmenUhly);
      setSensors(false);
    }
  }

  useEffect(() => {
    //normalne nic nedela
    //ale kdyz ukoncime aplikaci
    return () => {
      //tak zrusime sledovani zmen v device orientation
      window.removeEventListener("deviceorientation", zmenUhly);
    }
  }, []);

  //pomocna funkce pro udrzeni hodnoty v rozsahu -max az max
  function limit(value, max) {
    let res = value;
    //hodnota nesmi byt vetsi jak max
    if(res > max) {
      //pokud ano, oriznu na max
      res = max;
    }
    //hodnota nesmi byt mensi jak -max
    if(res < -max) {
      //pokud ano, oriznu na -max
      res = -max;
    }
    //vratime res
    return res;
  }

  //vypocet x a y
  const MAX = 100;
  const x = limit(gamma, MAX);
  const y = limit(beta, MAX);

  return (
    <div>
      <h1>Device orientation</h1>
      <button
        onClick={switchSensors}
      >
        Zapnou senzory
      </button>
      {((sensors === true) ? <div className="sensors">alpha: {alpha.toFixed(0)}</div> : null)}
      {((sensors === true) ? <div className="sensors">beta:  {beta.toFixed(0)} </div> : null)}
      {((sensors === true) ? <div className="sensors">gamma: {gamma.toFixed(0)}</div> : null)}

      {((sensors === true) ?
        <div className="area">
          <div 
            className="dot"
            style={{transform: "translate(-50%, -50%) translate(" + x + "px, " + y + "px)"}}
          >
          </div>
        </div>
      : null)}
    </div>
  )
}

export default App
