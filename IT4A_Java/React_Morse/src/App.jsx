import { useState } from 'react'
import './App.css'

function App() {
  //useStates
  //tohle bude pro text od uzivatele
  const [text, setText] = useState("");
  //tohle bude pro morseovku
  const [morse, setMorse] = useState("");

  //pole stringu morseovy abecedy
  const morseAlphabeth = [ ".-", "-...", "-.-.", "-..", ".", "..-.",
    "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---",
    ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-",
    "-.--", "--.."];

    //casove konstanty
    const VIB_TECKA = 250;
    const VIB_CARKA = 500;
    const VIB_PAUSE = 350;

  //funkce pro prevod textu do morseovky
  function prevodMorse() {
    //promenna pro vysledek
    let result = "";

    //projdeme text znak po znaku
    for(let i = 0; i < text.length; i++) {
      //nactu znak jako cislo (ASCII kod)
      const znak = text.charCodeAt(i);
      //kontrola
      if((znak >= "A".charCodeAt(0)) && (znak <= "Z".charCodeAt(0))) {
        //je to velke pismeno
        result += morseAlphabeth[znak - "A".charCodeAt(0)] + "/";
      } else if((znak >= "a".charCodeAt(0)) && (znak <= "z".charCodeAt(0))) {
        //je to male pismeno
        result += morseAlphabeth[znak - "a".charCodeAt(0)] + "/";
      } else if(znak === " ".charCodeAt(0)) {
        //je to mezera
        result += "/";
      } else {
        //je to neco jineho
        result += "?";
      }
    }

    //vysledek po prevodu ulozime do morse-stringu
    setMorse(result);
  }

  //pomocna funkce pro zdrzeni programu
  function pockej(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function vibrovatMorse() {
    //kontrola
    if(!("vibrate" in navigator)) {
      //zarizeni neumi vibrovat
      alert("Vibrace nejsou podporaovany");
      return;
    }
    //kdyz to projde sem, tak umime vibrace
    //projdeme celou morseovku
    for(let i = 0; i < morse.length; i++) {
      //nacteme znak
      const znak = morse[i];
      //kontrola
      if(znak === ".") {
        //je to tecka -> vibrujeme kratce
        navigator.vibrate(VIB_TECKA);
        //chvilku pockame
        await pockej(VIB_TECKA + VIB_PAUSE);
      } else if(znak === "-") {
        //je to carka -> vibrujeme dlouze
        navigator.vibrate(VIB_CARKA);
        //chvilku pockame
        await pockej(VIB_CARKA + VIB_PAUSE);
      } else if(znak === "/") {
        //je to pauza -> pockame dele
        await pockej(VIB_PAUSE);
      }
    }

  }

  return (
    <div>
      <h1>React Morse</h1>
      <textarea
        placeholder="Napiš text který chceš převést na morseovku"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={prevodMorse}
      >
        Převést na morseovku
      </button>
      <button
        onClick={() => {
          setText("");
          setMorse("");
        }}
      >
        Vymazat
      </button>
      <div id="morse_div">
        Morseovka:<br /> {morse}
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
