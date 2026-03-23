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

  //pomocna funkce
  function correct(value, max) {
    let res = value;
    //hodnota nesmi byt vetsi jak max
    if(res > max) {
      res = max;
    }
    //hodnota nesmi byt mensi jak -max
    if(res < -max) {
      res = -max;
    }
    return res;
  }

  //spocitame x a y pro vodovahu
  const MAX = 100;
  const x = correct(gamma, MAX);
  const y = correct(beta, MAX);

  return (
    <div>
      <h1>Device orientation</h1>
      <button
        onClick={switchSensors}
      >
        {(sensors === false) ? "Zapnout senzory" : "Vypnout senzory"}
      </button>
      {/* schovame divy, pokud jsou senzory vypnute */}
      {((sensors === true) ? <div className="sensors">alpha: {alpha.toFixed(0)}</div> : null)}
      {((sensors === true) ? <div className="sensors">beta:  {beta.toFixed(0)} </div> : null)}
      {((sensors === true) ? <div className="sensors">gamma: {gamma.toFixed(0)}</div> : null)}
      {/* vodovaha */}
      {((sensors === true) ?
        <div className="area">
          <div 
            className="dot"
            style={{
              transform: "translate(-50%, -50%) translate(" + x + "px, " + y + "px)"
            }}
          ></div>
        </div>
      : null)}
    </div>
  )
}

export default App
