import { useEffect, useState } from 'react'
import './App.css'

function App() {
  //cas ktery budu odpocitavat
  const [seconds, setSeconds] = useState(0);
  //stav odpoctu - bezi / nebezi
  const [running, setRunning] = useState(false);

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

  const showNotification = async () => {
    //zjistime jestli mame povoleni pro notifikaci
    const perm = await Notification.requestPermission();

    if((perm === "granted") && ("serviceWorker" in navigator)) {
      //mame povolene notifikace + mame zaregistrovany sw
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification("Čas vypršel", {
        vibrate: [200, 100, 200]
      });
    } else {
      alert("Prosim povol notifikace");
    }
  };
  
  const addTime = () => {
    setSeconds(seconds + 10);
  }

  const subTime = () => {
    //kontrola abych nesel pod 0
    if((seconds - 10) >= 0) {
      setSeconds(seconds - 10);
    }
  }

  const launchCount = () => {
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
    </div>
  )
}

export default App
