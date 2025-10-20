import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  //cas ktery budu odpocitavat
  const [seconds, setSeconds] = useState(getSecondsFromLocStor());
  //stav odpoctu - bezi / nebezi
  const [running, setRunning] = useState(getRunningFromLocStor());
  //prepinac zvuku notifikace
  const [soundEnabled, setSoundEnabled] = useState(true);

  //reference / odkaz
  const intRef = useRef(null);

  function getSecondsFromLocStor() {
    const nacteno = localStorage.getItem("timerSeconds");
    if(nacteno !== null) {
      return parseInt(nacteno, 10);
    } else {
      return 0;
    }
  }

  function getRunningFromLocStor() {
    const nacteno = localStorage.getItem("timerRunning");
    if(nacteno !== null) {
      return (nacteno === "true");
    } else {
      return false;
    }
  }

  /*
  useEffect(() => {
    if(running) {
      const int = setInterval(() => {
        setSeconds((prev) => {
          if(prev <= 1) {
            //konec odpoctu
            clearInterval(int);
            setRunning(false);
            //zobrazime notifikaci
            showNotification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      //vycisteni intervalu pro pripda refreshe
      return () => clearInterval(int);
    }
  }, [running]);
  */

  useEffect(() => {
    if(running) {
      intRef.current = setInterval(tick, 1000);

      //ulozime do localStorage obe hodnoty
      localStorage.setItem("timerSeconds", seconds.toString());
      localStorage.setItem("timerRunning", running.toString());

      return () => clearInterval(intRef.current);
    }
  }, [running, seconds]);

  function tick() {
    if(seconds <= 1) {
      clearInterval(intRef.current);
      showNotification();
      setRunning(false);
      setSeconds(0);
      localStorage.setItem("timerSeconds", "0");
      localStorage.setItem("timerRunning", "false");
    } else {
      setSeconds(seconds - 1);
    }
  }

  const showNotification = async () => {
    //zjistime jestli mame povoleni pro notifikaci
    const perm = await Notification.requestPermission();

    if((perm === "granted") && ("serviceWorker" in navigator)) {
      //mame povolene notifikace + mame zaregistrovany sw
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification("Čas vypršel");

      if(soundEnabled) {
        try {
          const audio = new Audio("/beep.mp3");
          await audio.play();
        } catch(err) {
          console.log("Zvuk nelze prehrat: ", err);
        }
      }


    } else {
      alert("Prosim povol notifikace");
    }
  };
  
  /*
  const addTime = () => {
    setSeconds(seconds + 10);
  }
  */

  function addTime() {
    setSeconds(seconds + 10);
  }

  /*
  const subTime = () => {
    //kontrola abych nesel pod 0
    if((seconds - 10) >= 0) {
      setSeconds(seconds - 10);
    }
  }
  */

  function subTime() {
    if((seconds - 10) >= 0) {
      setSeconds(seconds - 10);
    }
  }

  /*
  const launchCount = () => {
    //nespustime odpocet kdyz je cas na 0
    if(seconds > 0) {
      setRunning(true);
    }
  }
  */

  function launchCount() {
    //nespustime odpocet kdyz je cas na 0
    if(seconds > 0) {
      setRunning(true);
    }
  }

  return (
    <div>
      <h1>Timer with notification</h1>
      <h2>{seconds} s</h2>
      <button
        onClick={addTime}
      >
        +10s
      </button>
      &nbsp;
      &nbsp;
      <button
        onClick={subTime}
      >
        -10s
      </button>
      <br />
      <br />
      <button
        onClick={launchCount}
      >
        Spustit odpocet
      </button>
      <br />
      <br />
      <input 
        type="checkbox"
        checked={soundEnabled}
        onChange={(e) => setSoundEnabled(e.target.checked)}
      /> Zapnout zvuk notifikace
    </div>
  )
}

export default App
