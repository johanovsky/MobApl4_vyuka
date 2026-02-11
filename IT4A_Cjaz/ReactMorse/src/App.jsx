import { useState } from 'react'
import './App.css'

function App() {
  //pro zadany text
  const [text, setText] = useState("");
  //pro prevedenou morseovku
  const [morse, setMorse] = useState("");

  //pole retezcu morseovky
  const morseAlphabet = [".-", "-...", "-.-.", "-..", ".", "..-.",
    "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---",
    ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-",
    "-.--", "--.."];

    //konstanty pro casy vibraci [ms]
    const VIB_TECKA = 250;
    const VIB_CARKA = 500;
    const VIB_PAUSE = 350;

  function prevodNaMorse() {
    //promenna pro vysledek
    let vysledek = "";

    //znak po znaku ctu vstupni text
    for(let i = 0; i < text.length; i++) {
      //nacteme ASCII kod akt. pismena
      const znak = text.charCodeAt(i);
      //kontrola
      if((znak >= "a".charCodeAt(0)) && (znak <= "z".charCodeAt(0))) {
        //je to male pismeno abecedy
        vysledek += morseAlphabet[znak - "a".charCodeAt(0)] + "/";
      } else if((znak >= "A".charCodeAt(0)) && (znak <= "Z".charCodeAt(0))) {
        //je to velke pismeno abecedy
        vysledek += morseAlphabet[znak - "A".charCodeAt(0)] + "/";
      } else if(znak === " ".charCodeAt(0)) {
        //je to mezera -> pridame jeste jedno lomitko
        vysledek += "/";
      } else {
        //cokoliv jineho bude chyba
        vysledek += "?";
      }
    }

    //slepeny vysledek ulozim do useState morse
    setMorse(vysledek);
  }

  //pomocna funkce pro pribrzdeni
  function pockej(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function vibrovatMorse() {
    //kontrola jestli zarizeni podporuje vibrace
    if(!("vibrate" in navigator)) {
      alert("Vibrace nejsou na zarizeni podporovany");
      return;
    }
    //pokud se dostaneme sem, vibrace jsou podporovany
    //projdeme retezec s morseovkou
    for(let i = 0; i < morse.length; i++) {
      //stahnu akt. znak
      const znak = morse[i];
      //porovnani
      if(znak === ".") {
        //je to tecka -> vibrujeme kratce
        navigator.vibrate(VIB_TECKA);
        //pockame delku tecky + pauza
        await pockej(VIB_TECKA + VIB_PAUSE);
      } else if(znak === "-") {
        //je to carka -> vibrujeme dlouze
        navigator.vibrate(VIB_CARKA);
        //pockame delku carky + pauza
        await pockej(VIB_CARKA + VIB_PAUSE);
      } else if(znak === "/") {
        //je to lomitko -> pockame dele
        await pockej(2*VIB_PAUSE);
      }
    }
  }

  return (
    <div>
      <h1>React Morse Code</h1>
      <textarea
        placeholder="Zadej text pro převod na morseovku"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
      <button 
        onClick={prevodNaMorse}
      >
        Převést na morseovku
      </button>
      <button 
        onClick={() => {
          setText("");
          setMorse("");
        }}
      >
        Smazat
      </button>
      <div id="morse_div">
        Morseovka: <br />{morse}
      </div>
      <button 
        onClick={vibrovatMorse}
      >
        Vibrovat morseovku
      </button>
    </div>
  )
}

export default App
