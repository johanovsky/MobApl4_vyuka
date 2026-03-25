import { useEffect, useState } from 'react'
import './App.css'

function App() {

  //useStates
  //pro uhly natoceni
  const [alpha, setAlpha] = useState(0);
  const [beta,  setBeta]  = useState(0);
  const [gamma, setGamma] = useState(0);

  //kvuli schovavani divu
  const [sensors, setSensors] = useState(false);

  function zmenUhly(event) {
    if(event.alpha !== null) {
      setAlpha(event.alpha);
    }
    if(event.beta !== null) {
      setBeta(event.beta);
    }
    /*
    if(event.gamma !== null) {
      setGamma(event.gamma);
    }
    */
    setGamma(event.gamma ?? 0);
  }

  async function switchSensors() {
    if(sensors === false) {
      //je vypnuto budeme zapinat
      try {
        setSensors(true);
        //kvuli IOS musime extra dat pristup k deviceorientation
        if((typeof DeviceOrientationEvent !== "undefined") &&
          (typeof DeviceOrientationEvent.requestPermission === "function")) {
            const resp = await DeviceOrientationEvent.requestPermission();
            //kdyz jsme nedostali pristup k senzorum -> konec
            if(resp !== "granted") return;
        }
        //sledovani zmen senzoru (musi byt jak pro And / IOS)
        window.addEventListener("deviceorientation", zmenUhly);
      } catch(err) {
        alert("Sensors error");
      }
    } else {
      //je zapnuto budeme vypinat
      //vypnuti sledovani senzoru
      window.removeEventListener("deviceorientation", zmenUhly);
      setSensors(false);
    }
  }

  //kvuli vypnuti sensoru pri opusteni aplikace
  useEffect(() => {
    //nic to nedela pri startu aplikace, ale zrusi to sledovani sensoru pri jejim ukonceni
    return ()=> window.removeEventListener("deviceorientation", zmenUhly);
  }, []);

  //pomocna funkce na omezeni minima a maxima
  function constrain(value, max) {
    let res = value;
    //hodnota nesmi byt vetsi jak max
    if(res > max) {
      //kdyz ano, oriznu na max
      res = max;
    }
    //hodnota nesmi byt mensi jak -max
    if(res < -max) {
      //kdyz ano, oriznu na -max
      res = -max;
    }
    return res;
  }

  //prevedeme beta a gama na x a y
  const MAX = 100;
  const x = constrain(gamma, MAX);
  const y = constrain(beta, MAX);

  return (
    <div>
      <h1>React Device Orientation</h1>
      <button
        onClick={switchSensors}
      >
        Zapnout senzory
      </button>
      {((sensors === true) ? <div className="sensors">alpha: {alpha.toFixed(0)}</div> : null)}
      {((sensors === true) ? <div className="sensors">beta:  {beta.toFixed(0)} </div> : null)}
      {((sensors === true) ? <div className="sensors">gamma: {gamma.toFixed(0)}</div> : null)}

      {((sensors === true) ?
        <div className="area">
          <div 
            className="dot"
            style={{transform: "translate(-50%, -50%) translate(" + x + "px, " + y + "px)"}}
          ></div>
        </div>
      : null)}
    </div>
  )
}

export default App
