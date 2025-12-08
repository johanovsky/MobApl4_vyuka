import { useEffect, useState } from 'react'
import './App.css'
import Slot from './Slot'

function App() {

  const min = 1;
  const max = 10;

  //pocet kliknuti na tlacitko - signal z App do Slotu aby znovu generoval
  const [spinCount, setSpinCount] = useState(0);
  //pole pro stazene hodnoty ze slotu
  const [slotValues, setSlotValues] = useState([0, 0, 0]);
  //vysledek hry
  const [result, setResult] = useState("");
  //aktualni stav konta
  const [cash, setCash] = useState(100);
  //aktualni sazka
  const [bet, setBet] = useState(10);
  //pro rozliseni prvni tocky
  const [firstSpin, setFirstSpin] = useState(false);
  //pro prepinani auto-spin
  const [autoSpin, setAutoSpin] = useState(false);

  function tocime() {
    if(bet > 0) {
      if(bet <= cash) {
        //v poradku, pustime dalsi tocku
        setSpinCount(spinCount + 1);
        //nastavime prvniSpin
        setFirstSpin(true);
      } else {
        //malo cash
        setResult("Nedostatek prostredku");
      }
    } else {
      //nelze vsadit 0 a mene
      setResult("Minimalni sazka je: 1");
    }
  }

  function stahniHodnotyZeSlotu(index, value) {
    setSlotValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  }

  function saveGame() {
    //objekt s daty
    const data = { cash, bet };
    //data prevedu na JSON string
    const json = JSON.stringify(data, null, "\t");
    //zabalime JSON string do binarnich dat
    const blob = new Blob([json], { type: "application/json"});
    //ted blob existuje v pameti prohlizece -> vygeneruju k nemu url
    const url = URL.createObjectURL(blob);
    //vytvorime "fake-odkaz"
    const odkaz = document.createElement("a");
    //odkazu nastavime href
    odkaz.href = url;
    //odkazu nastavime i jmeno
    odkaz.download = "slotMachine.json";
    //odkaz pridame do stranky
    document.body.appendChild(odkaz);
    //na odklaz klikneme
    odkaz.click();
    //odkaz vyhodime ze stranky
    document.body.removeChild(odkaz);
    //uvolnime pamet od blobu
    URL.revokeObjectURL(url);
  }

  async function loadGame() {
    try {
      //vytvorime "fake" input
      const input = document.createElement("input");
      //input nastavime typ na file
      input.type = "file";
      //nastavime jako prijmany typ souboru pouze JSON
      input.accept = "application/json";

      const file = await new Promise((resolve, reject) => {
        function getFile(event) {
          const selectedFile = event.target.files[0];
          if(selectedFile) resolve(selectedFile);
          else reject(new Error("Nebyl vybran soubor"));
        }
        //nastavime inputu udalost po zmene
        input.addEventListener("change", getFile);
        //klikneme na stahnout
        input.click();
      });

      //precteme soubor jako dlouhy string
      const text = await file.text();
      //precteme / zparsujeme text jako JSON
      const data = JSON.parse(text);

      //nastavime barevne slozky podle hodnot z dat
      setCash(data.cash ?? 0);
      setBet(data.bet ?? 0);
    } catch(err) {
      console.log(err);
      alert("Nebyl vybran zadny soubor");
    }
  }

  function prepniAutoSpin() {
    //vynulujeme stary result
    setResult("");
    //prepneme autospin
    setAutoSpin(!autoSpin);
  }

  const showNotification = async (text) => {
    //zjistime jestli mame povoleni pro notifikaci
    const perm = await Notification.requestPermission();

    if((perm === "granted") && ("serviceWorker" in navigator)) {
      //mame povolene notifikace + mame zaregistrovany sw
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification(text);
    } else {
      alert("Prosim povol notifikace");
    }
  };

  useEffect(() => {
    //pokud jeste neprobehl firstSpin
    if(firstSpin === false) {
      //tak konec
      return;
    }

    if((slotValues[0] > 0) && (slotValues[1] > 0) && (slotValues[2] > 0)) {
      //odecteme sazku
      let newCash = cash - bet;
      //vyhodnoceni
      if((slotValues[0] === slotValues[1]) && (slotValues[1] === slotValues[2])) {
        //TRIPLE
        setResult("TRIPLE");
        newCash = newCash + 3 * bet;
      } else if((slotValues[0] === slotValues[1]) || 
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
      //aktualizujeme cash
      setCash(newCash);
    }
  }, [slotValues]);

  useEffect(() => {
    //pouze pokud je zapnuty autospin
    if(autoSpin === true) {
      const int = setInterval(() => {
        //podminka pro ukonceni
        if((cash < bet) || (result === "DOUBLE") || (result === "TRIPLE")) {
          //vypneme autospin
          setAutoSpin(false);
          //pokud to byl double
          if((result === "DOUBLE") || (result === "TRIPLE")) {
            showNotification(result);
          }
        } else {
          //tocime dal
          tocime();
        }
      }, 1000);
      //vycistime interval z pameti
      return ()=> clearInterval(int);
    }
  }, [autoSpin, cash]);

  return (
    <div>
      <h1>React Cinkacka 2</h1>
      <div id="SlotMachine">
        <Slot min={min} max={max} novaTocka={spinCount} funkceProVraceniHodnoty={(v) => stahniHodnotyZeSlotu(0, v)} />
        <Slot min={min} max={max} novaTocka={spinCount} funkceProVraceniHodnoty={(v) => stahniHodnotyZeSlotu(1, v)} />
        <Slot min={min} max={max} novaTocka={spinCount} funkceProVraceniHodnoty={(v) => stahniHodnotyZeSlotu(2, v)} />
      </div>
      <div id="cash">
        <label>Stav konta: </label>
        <label>{cash}</label>
      </div>
      <div id="bet">
        <label>Sázka:</label>
        <input
          type="number"
          value={bet}
          onChange={(e)=>setBet(e.target.value)}
        />
      </div>
      <button 
        onClick={tocime}
      >
        TOČIT
      </button>
      <button 
        onClick={prepniAutoSpin}
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
      <div id="result">
        <h3>{result}</h3>
      </div>
    </div>
  )
}

export default App
