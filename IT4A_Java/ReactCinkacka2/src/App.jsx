import { useEffect, useState } from 'react'
import './App.css'
import Slot from './Slot';

function App() {
  const min = 1;
  const max = 10;

  //spinCount pro komunikaci se sloty
  const [spinCount, setSpinCount] = useState(0);
  //pole pro stazene hodnoty z slotu
  const [slotValues, setSlotValues] = useState([0, 0, 0]);
  //string s vysledkem
  const [result, setResult] = useState("");
  //aktualni stav konta
  const [cash, setCash] = useState(100);
  //aktualni sazka
  const [bet, setBet] = useState(10);
  //rozpoznani prvni tocky
  const [firstSpin, setFirstSpin] = useState(false);
  //prepinac pro autoSpin
  const [autoSpin, setAutoSpin] = useState(false);

  function nextSpin() {
    if(bet > 0) {
      if(bet <= cash) {
        setSpinCount(spinCount + 1);
        setFirstSpin(true);
      } else {
        setResult("Nedostatek prostredku");
      }
    } else {
      setResult("Minimalni sazka je 1");
    }
  }

  function stahniHodnotuDoPole(index, value) {
    setSlotValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  }

  function saveGame() {
    //vytvorime objekt s daty
    const data = {cash, bet};
    //prevede data do JSON
    const json = JSON.stringify(data, null, "\t");
    //zabalime json do bin. dat
    const blob = new Blob([json], {type: "application/json"});
    //na soubor vygeneruju odkaz
    const url = URL.createObjectURL(blob);
    //vytvorime "fake-odkaz"
    const odkaz = document.createElement("a");
    //odkazu nastavime href
    odkaz.href = url;
    //pojmenujeme soubor
    odkaz.download = "cinkacka.json";
    //vlozime odkaz do stranky
    document.body.appendChild(odkaz);
    //klikneme na stahnout
    odkaz.click();
    //odkaz hned zase odebereme
    document.body.removeChild(odkaz);
    //uvolnime blob z pameti
    URL.revokeObjectURL(url);
  }

  async function loadGame() {
    try {
      //vytvorime "fake" file input
      const input = document.createElement("input");
      //nastavime inputu typ: file
      input.type = "file";
      //nastavime inputu typ prijimanych souboru - volitelne
      input.accept = "application/json";

      const file = await new Promise((resolve, reject) => {
        function handleFile(event) {
          const selectedFile = event.target.files[0];
          if(selectedFile) resolve(selectedFile);
          else reject(new Error("Nebyl vybran soubor"));
        }
        //pridame posluchace zmeny tomu file-input
        input.addEventListener("change", handleFile);
        //kliknu na nacist soubor
        input.click();
      });

      //precteme soubor jako dlouhy string
      const text = await file.text();
      //string precteme jako JSON soubor
      const data = JSON.parse(text);

      //muzeme z dat nacist stav
      setCash(data.cash ?? 0);
      setBet(data.bet ?? 0);

    } catch(err) {
      console.log(err);
      alert("Nacitani se nezdarilo");
    }
  }

  function switchAutoSpin() {
    //vycistime stary result
    setResult("");
    setAutoSpin(!autoSpin);
  }

  const showNot = async (text) => {
    //pozadame o povoleni posilat notifikace
    const perm = await Notification.requestPermission();
    //jestlize uzivatel povolil notifikace a mam zaregistrovaneho sw
    if((perm === "granted") && ("serviceWorker" in navigator)) {
      //pres sw spustim notifikaci
      const reg = await navigator.serviceWorker.ready;
      //console.log(reg);
      reg.showNotification(text);
    } else {
      alert("Prosim povol notifikace");
    }
  };

  useEffect(() => {
    //pokud jeste neprobehl prvni spin
    if(firstSpin === false) {
      //tak konec
      return;
    }

    //odecteme sazku
    let newCash = cash - bet;
    if((slotValues[0] === slotValues[1]) && (slotValues[1] === slotValues[2])) {
      //TRIPLE
      setResult("TRIPLE");
      newCash = newCash + 3 * bet;
    } else if(
      (slotValues[0] === slotValues[1]) || 
      (slotValues[1] === slotValues[2]) || 
      (slotValues[0] === slotValues[2])
      ) {
      //DOUBLE
      setResult("DOUBLE");
      newCash = newCash + 2 * bet;
    } else {
      //LOST
      setResult("LOST");
    }
    setCash(newCash);
  }, [slotValues]);

  useEffect(() => {
    //pouze kdyz je autospin zapnuty
    if(autoSpin === true) {
      const int = setInterval(() => {
        //podminka pro ukonceni autospin
        if((cash < bet) || (result === "DOUBLE") || (result === "TRIPLE")) {
          //vypnuti autospinu
          setAutoSpin(false);
          //pokud to zkoncilo DOUBLE
          if(result === "DOUBLE") {
            showNot("DOUBLE");
          } else if(result === "TRIPLE") {
            showNot("TRIPLE");
          }
        } else {
          //tocime dal
          nextSpin();
        }
      }, 1000);
      //vycisteni intervalu z pameti
      return ()=> clearInterval(int);
    }
  }, [autoSpin, cash]);

  return (
    <div>
      <h1>React Cinkacka 2.0</h1>
      <div id="slotMachine">
        <Slot min={min} max={max} spinSignal={spinCount} vratHodnotu={(v) => stahniHodnotuDoPole(0, v)} />
        <Slot min={min} max={max} spinSignal={spinCount} vratHodnotu={(v) => stahniHodnotuDoPole(1, v)} />
        <Slot min={min} max={max} spinSignal={spinCount} vratHodnotu={(v) => stahniHodnotuDoPole(2, v)} />
      </div>
      <div id="cash">
        <label>Stav konta: </label>
        <label>{cash}</label>
      </div>
      <div id="bet">
        <label>Sázka: </label>
        <input
          type="number"
          value={bet}
          onChange={(e)=>setBet(Number(e.target.value))}
        />
      </div>
      <button 
        onClick={nextSpin}
      >
        SPIN
      </button>
      <button 
        onClick={switchAutoSpin}
      >
        AUTOSPIN
      </button>
      <button
        onClick={saveGame}
      >
          ULOŽIT
      </button>
      <button
        onClick={loadGame}
      >
          NAČÍST
      </button>
      <div>
        <h3>{result}</h3>
      </div>
    </div>
  )
}

export default App
