import { useEffect, useState } from 'react'
import './App.css'
import Slot from './Slot'

function App() {

  //minimum + maximum pro generovani
  const min = 1;
  const max = 10;
  //tohle budeme posilat do slotu, aby generovaly nove hodnoty
  const [spinCount, setSpinCount] = useState(0);
  //pole vytocenych hodnot
  const [slotValues, setSlotValues] = useState([0, 0, 0]);
  //pro vypis vysledku
  const [result, setResult] = useState("Zbohatni za 5 minut!!");
  //aktualni stav konta
  const [cash, setCash] = useState(100);
  //aktualni sazka
  const [bet, setBet] = useState(10);
  //pomocny useState pro rozliseni uplne prvniho spinu
  const [firstSpin, setFirstSpin] = useState(false);
  //prepinac pro autoSpin
  const [autoSpin, setAutoSpin] = useState(false);
  
  function zvysSpin() 
  {
    if(bet > 0) 
    {
      //nelze vsadit 0 a mene
      if(bet <= cash) {
        setFirstSpin(true);
        setSpinCount(spinCount+1);
      } 
      else 
      {
        setResult("Nedostatek prostředků pro hru");
      }
    } 
    else 
    {
      setResult("Nejnižší možná sázka je 1");
    }
  }

  function stahniHodnoty(index, value) 
  {
    setSlotValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  }

  async function saveGame() 
  {
    //vytvorim si objekt s daty
    const data = {cash, bet};
    //data prevedu na string
    const json_string = JSON.stringify(data, null, "\t");
    //data "zabalime" jako binarni soubor Binary Large Object
    const blob = new Blob([json_string], {type: "application/json"});
    //vyrobime odkaz na soubor v pameti prohlizece
    const url = URL.createObjectURL(blob);
    //vytvorime "fake-odkaz" na blob 
    const odkaz = document.createElement("a");
    odkaz.href = url;
    //navrhneme jmeno
    odkaz.download = "hra.json";
    //vlozime odkaz do stranky
    document.body.appendChild(odkaz);
    //"klikneme" na odkaz ke stazeni
    odkaz.click();
    //hned zase odkaz ze stranky odebereme
    document.body.removeChild(odkaz);
    //uvolnime blob z pameti
    URL.revokeObjectURL(url);
  }

  async function loadGame() 
  {
    try 
    {
      //vytvorime "fake" input
      const input = document.createElement("input");
      //nastavime mu typ file
      input.type = "file";
      //nastavime file-pickeru, ze bereme jen json-files
      input.accept = "application/json";
      //zavolame funkci, ktera vrati Promise, ktera vrati vybrany soubor
      const file = await new Promise((resolve, reject) => {
        function fileSelect(event) {
          const selectedFile = event.target.files[0];
          if(selectedFile != null) resolve(selectedFile);
          else reject(new Error("Nebyl vybran soubor"));
        }
        //nastavime file inputu - posluchace
        input.addEventListener("change", fileSelect);
        //"tukneme" na nacist
        input.click();
      });
      //precteme soubor jako dlouhy string
      const text = await file.text();
      //precteme string jako JSON 
      const data = JSON.parse(text);
      //nastavime barvy
      setCash(data.cash ?? 0);
      setBet(data.bet ?? 0);
    } 
    catch (err)
    {
      console.log(err);
      alert("Nacteni se nezdarilo");
    }
  }

  function spustAutoSpin() 
  {
    //vycistime stary result
    setResult("Zbohatni za 5 minut!!");
    setAutoSpin(!autoSpin);
  }

  const showMyNotification = async (text) => {
    const perm = await Notification.requestPermission();

    if((perm === "granted") && ("serviceWorker" in navigator)) {
      const sw = await navigator.serviceWorker.ready;
      sw.showNotification(text);
    } else {
      alert("Prosim povol notifikace");
    }
  }

  useEffect(() => {
    //pokud jeste neprobehl prvni spin
    if(firstSpin === false) 
    {
      //nic nedej
      return;
    }

    //vyhodnocujeme pouze pokud slotValues ma hodnotu jinou nez 0
    if((slotValues[0] > 0) && (slotValues[1] > 0) && (slotValues[2] > 0)) 
    {
      //odecteme sazku
      let newCash = cash - bet;
      if((slotValues[0] === slotValues[1]) && (slotValues[1] === slotValues[2]))
      {
        setResult("TRIPLE WIN !!!");
        //vyhra je 3* bet
        newCash = newCash + 3 * bet;
      }
      else if
      (
        (slotValues[0] === slotValues[1]) || 
        (slotValues[1] === slotValues[2]) || 
        (slotValues[0] === slotValues[2])
      )
      {
        setResult("DOUBLE WIN !!");
        //vyhra je 2* bet
        newCash = newCash + 2 * bet;
      }
      else 
      {
        setResult("PROHRA :-)");
      }
      //ulozime novou cash
      setCash(newCash);
    }
  }, [slotValues])

  useEffect(() => {
    if(autoSpin === true) 
    {
      const int = setInterval(() => {
        //podminka pro ukonceni
        if((cash < bet) || (result === "DOUBLE WIN !!") || (result === "TRIPLE WIN !!!")) 
        {
          //vypiname autoSpin
          setAutoSpin(false);
          //zobrazime notifikaci
          if(result === "DOUBLE WIN !!") 
          {
            showMyNotification("DOUBLE WIN !!");
          }
          else if(result === "TRIPLE WIN !!!") 
          {
            showMyNotification("TRIPLE WIN !!!");
          }
        } 
        else 
        {
          //tocime dal
          zvysSpin();
        }
      }, 1000);
      //smazeme z pameti interval
      return ()=> clearInterval(int);
    }
  }, [autoSpin, cash]);

  return (
    <div>
      <h1>React Cinkacka 2.0</h1>
      <div>
        <Slot min={min} max={max} spinSignal={spinCount} onValueChange={(v) => stahniHodnoty(0, v)} />
        <Slot min={min} max={max} spinSignal={spinCount} onValueChange={(v) => stahniHodnoty(1, v)} />
        <Slot min={min} max={max} spinSignal={spinCount} onValueChange={(v) => stahniHodnoty(2, v)}/>
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
          onChange={(e) => setBet(Number(e.target.value))} 
        />
      </div>
      <button onClick={zvysSpin} disabled={autoSpin}>
        SPIN
      </button>
      <button onClick={spustAutoSpin}>
        AUTOSPIN
      </button>
      <button onClick={saveGame}>
        Uložit
      </button>
      <button onClick={loadGame}>
        Načíst
      </button>
      <div>
        <h3>{result}</h3>
      </div>
    </div>
  )
}

export default App
