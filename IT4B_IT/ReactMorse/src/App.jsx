import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState("");
  const [morse, setMorse] = useState("");

  const morseAlphabeth = [".-", "-...", "-.-.", "-..", ".", "..-.",
    "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---",
    ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-",
    "-.--", "--.."];

  const VIB_TECKA = 250;
  const VIB_CARKA = 500;
  const VIB_PAUSE = 350;

  function prevodMorse() {
    let vysledek = "";
    //projdeme text znak po znaku
    for(let i = 0; i < text.length; i++) {
      //nactu znak jako cislo
      const znak = text.charCodeAt(i);
      //kontrola jake to je pismeno
      if((znak >= "A".charCodeAt(0)) && (znak <= "Z".charCodeAt(0))) {
        //je to velke pismeno abecedy
        vysledek += morseAlphabeth[znak - "A".charCodeAt(0)] + "/";
      } else if((znak >= "a".charCodeAt(0)) && (znak <= "z".charCodeAt(0))) {
        //je to male pismeno abecedy
        vysledek += morseAlphabeth[znak - "a".charCodeAt(0)] + "/";
      } else if(znak == " ".charCodeAt(0)) {
        //je to mezera
        vysledek += "/";
      } else {
        //cokoliv ostatni je chyba
        vysledek += "?";
      }
    }
    //slepeny retezec s morseovkou ulozim do useState morse
    setMorse(vysledek);
  }

  //pomocna metoda ktera pozdrzi program zadany cas
  function pockej(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function vibrovatMorse() {
    //kontrola jestli umime vibrovat
    if(!("vibrate" in navigator)) {
      //neumim vibrovat
      alert("Vibrace nejsou podporaovany");
      return;
    }

    //projdeme cele morse
    for(let i = 0; i < morse.length; i++) {
      //nacteme znak
      const znak = morse[i];
      //je-li to tecka
      if(znak === ".") {
        //vibrujeme tecku
        navigator.vibrate(VIB_TECKA);
        //chvilku pockame
        await pockej(VIB_TECKA + VIB_PAUSE);
      //je-li to carka
      } else if(znak === "-") {
        //vibrujeme carku
        navigator.vibrate(VIB_CARKA);
        //chvilku pockame
        await pockej(VIB_CARKA + VIB_PAUSE);
      //je-li to lomitko
      } else if(znak === "/") {
        //pockame
        await pockej(VIB_PAUSE);
      }
    }
  }

  return (
    <div>
      <h1>React Morse Code</h1>
      <textarea
        placeholder="Napis text ktery chces prevest na morseovku"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
      <button
        onClick={prevodMorse}
      >
        Prevest na morseovku
      </button>
      <button
        onClick={() => {
          setText("");
          setMorse("");
        }}
      >
        Vymazat
      </button>
      <div id="morseCode">
        Morseovka: <br /> {morse}
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
