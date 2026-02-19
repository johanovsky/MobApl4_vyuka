import { useState, useRef } from 'react'
import './App.css'

function App() {
  //useStates
  //tohle bude pro text od uzivatele
  const [text, setText] = useState("");
  //tohle bude pro morseovku
  const [morse, setMorse] = useState("");

  //useRefs
  //odkaz na stopu kamery, sice ho nikde nezobrazuju, ale potrebuju ho kvuli obsluze ledky
  const videoRef = useRef(null);

  //pole stringu morseovy abecedy
  const morseAlphabeth = [ ".-", "-...", "-.-.", "-..", ".", "..-.",
    "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---",
    ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-",
    "-.--", "--.."];

    //casove konstanty
    const VIB_TECKA = 250;
    const VIB_CARKA = 500;
    const VIB_PAUSE = 350;

    //konstanty pro pipani
    const BEEP_TECKA = VIB_TECKA;
    const BEEP_CARKA = VIB_CARKA;
    const BEEP_PAUSE = VIB_PAUSE;
    const BEEP_FREQ = 440;

    //konstanty pro blikani
    const LED_TECKA = VIB_TECKA;
    const LED_CARKA = VIB_CARKA;
    const LED_PAUSE = VIB_PAUSE;

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
  
  //cas [ms], freq [Hz]
  async function beep(ms, frequency) {
    //vytahnu si audio-kontext prohlizece
    //kompatibilni verze
    //const context = new (window.AudioContext || window.webkitAudioContext)();
    const context = new window.AudioContext();
    //vytvorim generator vlny
    const oscilator = context.createOscillator();
    //nastavime oscilator
    //typ vlny - square = obdelnik, sine, triangle, sawtooth
    oscilator.type = "square";
    //nastavime frekvenci
    oscilator.frequency.value = frequency;
    //pripojime oscilator na reproduktor
    oscilator.connect(context.destination);

    //spustime oscilator
    oscilator.start();
    //chvilku ho nechame znit
    await pockej(ms);
    //oscilator zastavime
    oscilator.stop();

    //uvolneni syst. prostredku
    context.close();
  }

  async function pipatMorse() {
    //projdeme cely string s morseovkou
    for(let i = 0 ; i < morse.length; i++) {
      //vytahnu si znak
      const znak = morse[i];
      //je-li to tecka
      if(znak === ".") {
        //je to tecka -> pipneme kratce
        await beep(BEEP_TECKA, BEEP_FREQ);
        //chvilku pockame
        await pockej(BEEP_PAUSE);
      }
      //je-li to carka
      else if(znak === "-") {
        //je to carka -> pipneme dlouze
        await beep(BEEP_CARKA, BEEP_FREQ);
        //chvilku pockame
        await pockej(BEEP_PAUSE);
      }
      //je-li to lomitko
      else if(znak === "/") {
        //delsi chvilku pockame
        await pockej(2 * BEEP_PAUSE);
      }
    }
  }

  async function pripravKameru() {
    //kontrola jestli kamera uz neni aktivni
    if(videoRef.current !== null) {
      //kamera uz je ready, nic dalsiho nepotrebuji
      return;
    }
    //kamera neni ready -> pozadame o pristup k zadni kamere
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: "environment"}
    });
    //stahnu si video-stopu a ulozim do reference
    videoRef.current = stream.getVideoTracks()[0];
  }

  //true = rozsvitit / false zhasnout
  async function setCameraLed(state) {
    ///kontrola
    if(videoRef.current === null) {
      //kamera neni ready -> konec
      return;
    }
    //kamera je ready -> rozsvitime / zhasneme
    await videoRef.current.applyConstraints({
      advanced: [{torch: state}]
    });
  }

  function vypniKameru() {
    if(videoRef.current !== null) {
      //kamera jede
      //zastavime stream
      videoRef.current.stop();
      //video-ref nastavime zpet do null
      videoRef.current = null;
    }
  }

  async function blikatMorse() {
    try {
      //nejprve pripravime kameru
      await pripravKameru();

      //prochazime celou morseovku
      for(let i = 0; i < morse.length; i++) {
        //vytahnu znak
        const znak = morse[i];
        if(znak === ".") {
          //je to tecka
          //rozsvit
          await setCameraLed(true);
          //pockame tecku
          await pockej(LED_TECKA);
          //zhasneme
          await setCameraLed(false);
          //pockame pauzu
          await pockej(LED_PAUSE);
        } else if(znak === "-") {
          //je to carka
          //rozsvit
          await setCameraLed(true);
          //pockame carku
          await pockej(LED_CARKA);
          //zhasneme
          await setCameraLed(false);
          //pockame pauzu
          await pockej(LED_PAUSE);
        } else if(znak === "/") {
          //je to lomitko
          await pockej(2 * LED_PAUSE);
        }
      }
    } catch(e) {
        alert("LED neni dostupna");
    } finally {
      //vzdy vypneme kameru
      vypniKameru();
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
      <button
        onClick={pipatMorse}
      >
        Pipat morseovku
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
