import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(getSecondsFromLocStor());
  const [running, setRunning] = useState(getRunningFromLocStor());
  const [beepEnabled, setBeepEnabled] = useState(true);

  const intervaRef = useRef(null);

  function getSecondsFromLocStor() {
    const savedSeconds = localStorage.getItem("timerSeconds");
    if(savedSeconds === null) {
      return 0;
    } else {
      return parseInt(savedSeconds, 10);
    }
  }

  function getRunningFromLocStor() {
    const savedRunning = localStorage.getItem("timerRunning");
    if(savedRunning === null) {
      return false;
    } else {
      return (savedRunning === "true");
    }
  }

  useEffect(() => {
    if(running) {
      intervaRef.current = setInterval(tick, 1000);

      //ulozeni stav do localStorage
      localStorage.setItem("timerSeconds", seconds.toString());
      localStorage.setItem("timerRunning", running.toString());

      return () => clearInterval(intervaRef.current);
    }
  }, [running, seconds]);

  function tick() {
    if(seconds <= 1) {
      clearInterval(intervaRef.current);
      showNot();
      setRunning(false);
      setSeconds(0);
      //ulozeni stav do localStorage
      localStorage.setItem("timerSeconds", "0");
      localStorage.setItem("timerRunning", "false");
    } else {
      setSeconds(seconds - 1);
    }
  }

  /*
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
  */

  const showNot = async () => {
    //pozadame o povoleni posilat notifikace
    const perm = await Notification.requestPermission();
    //jestlize uzivatel povolil notifikace a mam zaregistrovaneho sw
    if((perm === "granted") && ("serviceWorker" in navigator)) {
      //pres sw spustim notifikaci
      const reg = await navigator.serviceWorker.ready;
      //console.log(reg);
      reg.showNotification("Odpočet doběhl");

      //prehrati zvuku
      if(beepEnabled) {
        try {
          const audio = new Audio("/beep.mp3");
          await audio.play();
        } catch(err) {
          console.log("Nezdarilo se prehrati zvuku");
        }
      }

    } else {
      alert("Prosim povol notifikace");
    }
  };

  /*
  //Pridavani casu do odpoctu
  const addSeconds = () => {
    setSeconds(seconds + 10);
  };
  */
  function addSeconds() {
    setSeconds(seconds + 10);
  }

  /*
  //Odebirani casu do odpoctu
  const subSeconds = () => {
    if((seconds - 10) >= 0) {
      setSeconds(seconds - 10);
    }
  };
  */

  function subSeconds() {
    if((seconds - 10) >= 0) {
      setSeconds(seconds - 10);
    }
  }

  /*
  //Spusteni odpoctu
  const launchTimer = () => {
    if(seconds > 0) {
      setRunning(true);
    }
  };
  */

  function launchTimer() {
    if(seconds > 0) {
      setRunning(true);
    }
  }

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
      <br />
      <br />
      <input 
        type="checkbox"
        checked={beepEnabled}
        onChange={(e) => setBeepEnabled(e.target.checked)}
      /> Zapnout zvukove notifikace
    </div>
  )
}

export default App
