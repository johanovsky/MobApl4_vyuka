import { useState, useRef } from 'react'
import './App.css'

function App() {
  //useStates
  //pro zadany text
  const [text, setText] = useState("");
  //pro prevedenou morseovku
  const [morse, setMorse] = useState("");

  //useRefs
  //kvuli obsluze ledky na kamere
  const videoTrackRef = useRef(null);

  //pole retezcu morseovky
  const morseAlphabet = [".-", "-...", "-.-.", "-..", ".", "..-.",
    "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---",
    ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-",
    "-.--", "--.."];

    //konstanty pro casy vibraci [ms]
    const VIB_TECKA = 250;
    const VIB_CARKA = 500;
    const VIB_PAUSE = 350;

    //konstanty pro pipani [ms]
    const BEEP_TECKA = VIB_TECKA;
    const BEEP_CARKA = VIB_CARKA;
    const BEEP_PAUSE = VIB_PAUSE;
    //freknce pipani [Hz]
    const BEEP_FREQ = 440;

    //konstanty pro casy blikani [ms]
    const LED_TECKA = VIB_TECKA;
    const LED_CARKA = VIB_CARKA;
    const LED_PAUSE = VIB_PAUSE;

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

  async function beep(ms, frequency) {
    //potrebujeme Audio-context
    //kompatibilni verze
    //const context = new (window.AudioContext || window.webkitAudioContext)();
    const context = new window.AudioContext();
    //vytvorime oscilator - generator vlny
    const oscilator = context.createOscillator();
    //nastaveni oscilatoru
    //typ vlny - square / sine / triangle / sawtooth
    oscilator.type = "square";
    //frekvence vlny v Hz
    oscilator.frequency.value = frequency;
    //pripojime to na reproduktor
    oscilator.connect(context.destination);
    //nyni spustime pripraveny oscilator
    oscilator.start();
    //pockame zadany cas
    await pockej(ms);
    //osclilator zastavime
    oscilator.stop();
    //uvolneni systemovych prostredku
    context.close();
  }

  async function pipatMorse() {
    //projdeme celou morseovku
    for(let i = 0; i < morse.length; i++) {
      //vytahnu si znak
      const znak = morse[i];
      //je-li to tecka
      if(znak === ".") {
        //pipneme kratce
        await beep(BEEP_TECKA, BEEP_FREQ);
        //pockame
        await pockej(BEEP_PAUSE);
      }
      //je-li to carka
      else if(znak === "-") {
        //pipneme dlouze
        await beep(BEEP_CARKA, BEEP_FREQ);
        //pockame
        await pockej(BEEP_PAUSE);
      }
      //je-li to lomitko
      else if(znak === "/") {
        //pockame delsi pauzu
        await pockej(2 * BEEP_PAUSE);
      }
    }
  }

  async function pripravKameru() {
    //kontrola jestli uz kamera neni pripravena
    if(videoTrackRef.current !== null) {
      //kamera je ready, koncime
      return;
    }
    //pozadame o pristup k zadni kamere
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: "environment"}
    });
    //ulozime se odkaz na stopu do reference
    videoTrackRef.current = stream.getVideoTracks()[0];
  }

  //metoda pro ovladani ledky na kamere - true = sviti / false = zhasnuto
  async function setCameraLed(state) {
    //kontrola pripravenosti kamery
    if(videoTrackRef.current === null) {
      //kamera neni pripravena -> konec
      return;
    }
    //kamera je pripravena - bude rozsvecet / zhasinat
    await videoTrackRef.current.applyConstraints({
      advanced: [{torch: state}]
    });
  }

  function vypniKameru() {
    //kontrola
    if(videoTrackRef.current !== null) {
      //zastavime stopu
      videoTrackRef.current.stop();
      //vynulujeme referenci
      videoTrackRef.current = null;
    }
  }

  async function blikatMorse() {
    try {
      //nejprve pripravime kameru
      await pripravKameru();
      //projdeme celou morseovku
      for(let i = 0; i < morse.length; i++) {
        //vytahnu si znak
        const znak = morse[i];
        //je-li to tecka
        if(znak === ".") {
          //rozsvit
          await setCameraLed(true);
          //pockej tecku
          await pockej(LED_TECKA);
          //zhasni
          await setCameraLed(false);
          //pockej pauzu
          await pockej(LED_PAUSE);
        }
        //je-li to carka
        else if(znak === "-") {
          //rozsvit
          await setCameraLed(true);
          //pockej carku
          await pockej(LED_CARKA);
          //zhasni
          await setCameraLed(false);
          //pockej pauzu
          await pockej(LED_PAUSE);
        }
        //je-li to lomitko
        else if(znak === "/") {
          //pockej delsi pauzu
          await pockej(2 * LED_PAUSE);
        }
      }
    } catch(e) {
      alert("LED neni dostupna");
    } finally {
      //toto se spusti vzdy
      vypniKameru();
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
      <button 
        onClick={pipatMorse}
      >
        Pípat morseovku
      </button>
      <button 
        onClick={blikatMorse}
      >
        Blikat morseovku
      </button>
    </div>
  )
}

export default App
