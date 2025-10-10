import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    //kdyz je spustena casomira
    if(running) {
      //spust Interval
      const int = setInterval(() => {
        //snizujeme sekundy o 1
        setSeconds((prev) => {
          if(prev <= 1) {
            //dobehl odpocet
            showNot();
            clearInterval(int);
            setRunning(false);
            return 0;
          }
          return prev - 1; 
        });
      }, 1000);
      //vycisteni intervalu
      return () => clearInterval(int);
    }
  }, [running]);

  const showNot = async () => {
    //pozadame o povoleni posilat notifikace
    const perm = await Notification.requestPermission();
    //jestlize uzivatel povolil notifikace a mam zaregistrovaneho sw
    if((perm === "granted") && ("serviceWorker" in navigator)) {
      //pres sw spustim notifikaci
      const reg = await navigator.serviceWorker.ready;
      //console.log(reg);
      reg.showNotification("Odpočet doběhl");
    } else {
      alert("Prosim povol notifikace");
    }
  };

  //Pridavani casu do odpoctu
  const addSeconds = () => {
    setSeconds(seconds + 10);
  };

  //Odebirani casu do odpoctu
  const subSeconds = () => {
    if((seconds - 10) >= 0) {
      setSeconds(seconds - 10);
    }
  };

  //Spusteni odpoctu
  const launchTimer = () => {
    if(seconds > 0) {
      setRunning(true);
    }
  };

  return (
    <div>
      <h1>React timer with notification</h1>
      <h2>{seconds} s</h2>
      <button
        onClick={addSeconds}
      >
        +10s
      </button>
      &nbsp;&nbsp;
      <button
        onClick={subSeconds}
      >
        -10s
      </button>
      <br />
      <br />
      <button
        onClick={launchTimer}
      >
        Launch
      </button>
    </div>
  )
}

export default App
