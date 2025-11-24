import { useState } from 'react'
import './App.css'
import ColorSlider from './ColorSlider';

function App() {
  //aktualni stav red, green, blue
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  async function saveColor() {
    try {
      //co budeme ukladat
      const data = {red, green, blue};
      const options = {
        //navrhneme jmeno souboru
        suggestedName: "barva.json",
        //typy souboru ktere dovolime ukladat
        types: [
          {
            description: "JSON file",
            accept: {"application/json": [".json"]},
          },
        ]
      }

      //otevreme save dialog -> k ziskani odkazu na soubor
      const handle = await window.showSaveFilePicker(options);
      //objekt typu FileSystemWriteableFileStream
      const writable = await handle.createWritable();
      //zapiseme data jako String do souboru
      //data - co se zapisuje
      //null - replacer (kdybych potreboval upravu dat)
      //\t - odsazeni
      await writable.write(JSON.stringify(data, null, "\t"));
      //uzavreme zapis. proud
      await writable.close();
    } catch(err) {
      console.log(err);
      alert("Ulozeni se nezdarilo, asi nepodporovany prohlizec");
    }
  }

  async function loadColor() {
    try {
      //bez destruovani pole
      const handles = await window.showOpenFilePicker();
      const handle = handles[0];

      /*
      const [handle] = await window.showOpenFilePicker();
      */

      //potrebuji file
      const file = await handle.getFile();
      //precteme ten soubor jako string
      const text = await file.text();
      //precteme string jako JSON
      const data = JSON.parse(text);

      //z dat naplnime promenne
      //varianta ??
      setRed(data.red ?? 0);

      //varianta if
      if(data.green) {
        setGreen(data.green);
      } else {
        setGreen(0);
      }

      setBlue(data.blue ?? 0);

    } catch(err) {
      console.log(err);
      alert("Nacteni se nezdarilo");
    }
  }

  return (
    <>
      <h1>React ColorMixer</h1>
      {/* Tady je vybarvovany div */}
      <div
        id="color_box"
        style={{backgroundColor: "rgb(" + red + ", " + green 
        + ", " + blue + ")"}}
      >  
      </div>
      {/* Tady budou posuvniky */}
      <ColorSlider label="Red" value={red} func={setRed} />
      <ColorSlider label="Green" value={green} func={setGreen} />
      <ColorSlider label="Blue" value={blue} func={setBlue} />
      {/* Tady budou tlacitka */}
      <button onClick={saveColor}>Uložit barvu</button>
      <button onClick={loadColor}>Načíst barvu</button>
    </>
  )
}

export default App
