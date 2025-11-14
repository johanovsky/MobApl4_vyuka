import { useState } from 'react'
import './App.css'
import ColorSlider from './ColorSlider';

function App() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  async function saveColor() {
    try {
      //data ktera se budou ukladat
      const data = {red, green, blue};
      //pole s nastaveni pro ukladaci dialog
      const opt = {
        //prednastavene jmeno
        suggestedName: "barva.json",
        //typy souboru ktere dovolime ulozit
        types: [
          {
            description: "JSON file",
            accept: {"application/json": [".json"]},
          },
        ]
      }
      //otevreme dialog. okno pro ulozeni souboru -> dostaneme odkaz na soubor
      const fileHandle = await window.showSaveFilePicker(opt);
      //pripojime k souboru zapisovaci proud
      const writable = await fileHandle.createWritable();
      //zapiseme data pres proud
      await writable.write(JSON.stringify(data, null, "\t"));
      //uzavreme zapis. proud
      await writable.close();
    } catch (err) {
      console.log(err);
      alert("Ulozeni se nezdarilo, asi nepodporovany prohlizec");
    }
  }

  async function loadColor() {
    try {
      //potrebujeme odkaz na jeden soubor
      //destruovani pole
      //const [handle] = await window.showOpenFilePicker();
      //bez destruovani
      const fileHandles = await window.showOpenFilePicker();
      const fileHandle = fileHandles[0];
      //pres odkaz se dostaneme k souboru
      const file = await fileHandle.getFile();
      //precteme cely soubor do stringu
      const text = await file.text();
      //precteme cely string jako JSON
      const data = JSON.parse(text);
      //nastavime hodnoty
      setRed(data.red ?? 0);
      if(data.green == null) {
        setGreen(0);
      } else {
        setGreen(data.green);
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
      {/* Zde je vybarvovaci box */}
      <div 
        id="color_box"
        style={{
          backgroundColor: "rgb(" + red + ", " + green + ", " + blue + ")"
        }}
      >
      </div>
      {/* Zde budou posuvniky */}
      <ColorSlider label="Red" value={red} func={setRed} />
      <ColorSlider label="Green" value={green} func={setGreen} />
      <ColorSlider label="Blue" value={blue} func={setBlue} />
      {/* Zde budou tlacitka */}
      <button onClick={saveColor}>Uložit</button>
      <button onClick={loadColor}>Načíst</button>
    </>
  )
}

export default App
