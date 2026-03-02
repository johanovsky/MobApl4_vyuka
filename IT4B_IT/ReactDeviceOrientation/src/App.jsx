import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';

function App() {
  //useStates pro uhly natoceni
  const [alpha, setAlpha] = useState(0);
  const [beta,   setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);

  //tohle bude pro vypinani / zapinani sensoru
  const [sensors, setSensors] = useState(false);

  function zmenaUhlu(event) {
    if(event.alpha === null) {
      setAlpha(0);
    } else {
      setAlpha(event.alpha);
    }
    setBeta(event.beta ?? 0);
    setGamma(event.gamma ?? 0);
  }

  async function switchSensors() {
    if(sensors === false) {
      //jsou vypnute -> zapiname
      try {
        //Pro Ios je vyzadovano jeste toto
        if((typeof DeviceOrientationEvent !== "undefined") && 
          (typeof DeviceOrientationEvent.requestPermission === "function")) {
            const response = await DeviceOrientationEvent.requestPermission();
            if(response !== "granted") return; //nedostali jsme pristup
        }
        //Pro obe platformy (And / Ios) musi byt toto
        window.addEventListener("deviceorientation", zmenaUhlu);
        setSensors(true);
      } catch(err) {
        alert("Sensors error");
      }
    } else {
      //jsou zapnute -> vypiname
      window.removeEventListener("deviceorientation", zmenaUhlu);
      setSensors(false);
    }
  }

  useEffect(() => {
    //odebereme posluchace udalosti pri refreshi aplikace
    return () => {
      window.removeEventListener("deviceorientation", zmenaUhlu);
    };
  }, []);

  return (
    <div>
      <h1>Device orientation</h1>
      <button
        onClick={switchSensors}
      >
        {(sensors === false) ? "Zapnout senzory" : "Vypnout senzory"}
      </button>
      {/* schovame divy, pokud jsou senzory vypnute */}
      {((sensors === true) ? <div>alpha: {alpha.toFixed(0)}</div> : null)}
      {((sensors === true) ? <div>beta:  {beta.toFixed(0)} </div> : null)}
      {((sensors === true) ? <div>gamma: {gamma.toFixed(0)}</div> : null)}
    </div>
  )
}

export default App
