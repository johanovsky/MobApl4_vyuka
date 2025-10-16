import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

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

  const showMyNotification = async () => {
    const perm = await Notification.requestPermission();

    if((perm === "granted") && ("serviceWorker" in navigator)) {
      const sw = await navigator.serviceWorker.ready;
      sw.showNotification("Odpočet doběhl");
    } else {
      alert("Prosim povol notifikace");
    }
  }

  const plusCas = () => {
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
    </>
  )
}

export default App
