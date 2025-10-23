import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(getSecondsFromLS());
  const [running, setRunning] = useState(getRunningFromLS());
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intRef = useRef(null);

  function getSecondsFromLS() {
    const saved = localStorage.getItem("timerSeconds");
    if(saved !== null) {
      return parseInt(saved, 10);
    } else {
      return 0;
    }
  }

  function getRunningFromLS() {
    const saved = localStorage.getItem("timerRunning");
    if(saved !== null) {
      return (saved === "true");
    } else {
      return false;
    }
  }

  /*
  useEffect(() => {
    if(running) {
      //je spusten odpocet
      const int = setInterval(() => {
        setSeconds((prev) => {
          if(prev <= 1) {
            setRunning(false);
            clearInterval(int);
            showMyNotification();
            return 0;
          }
          return prev-1;
        });
      }, 1000);
      //vyčistíme interval
      return () => clearInterval(int);
    }
  }, [running]); 
  */

  useEffect(runningFunkce, [running, seconds]);

  function runningFunkce() 
  {
    if(running) 
    {
      intRef.current = setInterval(tick, 1000);

      //ulozime akt. stav seconds a running do locStorage
      localStorage.setItem("timerSeconds", seconds.toString());
      localStorage.setItem("timerRunning", running.toString());

      return () => clearInterval(intRef.current);
    }
  }

  function tick() 
  {
    if(seconds <= 1) 
    {
      clearInterval(intRef.current);
      showMyNotification();
      setRunning(false);
      setSeconds(0);
      //posledni ulozeni do locStorage
      localStorage.setItem("timerSeconds", "0");
      localStorage.setItem("timerRunning", "false");
    } 
    else 
    {
      setSeconds(seconds - 1);
    }
  }

  const showMyNotification = async () => {
    const perm = await Notification.requestPermission();

    if((perm === "granted") && ("serviceWorker" in navigator)) {
      const sw = await navigator.serviceWorker.ready;
      sw.showNotification("Odpočet doběhl");

      if(soundEnabled)
      {
        try 
        {
          const audio = new Audio("/beep.mp3");
          await audio.play();
        } 
        catch (err) 
        {
          console.log("Zvuk nelze prehrat");
        }
      }

    } else {
      alert("Prosim povol notifikace");
    }
  }

  /*
  const plusCas = () => {
    setSeconds(seconds + 10);
  }
  */

  function plusCas()
  {
    setSeconds(seconds + 10);
  } 

  function minusCas() {
    if((seconds - 10) >= 0) {
      setSeconds(seconds - 10);
    }
  }

  function spustOdpocet() {
    if(seconds > 0) {
      setRunning(true);
    }
  }

  return (
    <>
      <h1>React timer with notification</h1>
      <h2>{seconds} s</h2>
      <button onClick={plusCas}> +10s </button>
      &nbsp;&nbsp;
      <button onClick={minusCas}> -10s </button>
      <br />
      <br />
      <button onClick={spustOdpocet}> Spustit odpočet </button>
      <br />
      <br />
      <input 
        type="checkbox" 
        checked={soundEnabled} 
        onChange={(e) => setSoundEnabled(e.target.checked)}
      /> Zapnout zvuk notifikace
    </>
  )
}

export default App
