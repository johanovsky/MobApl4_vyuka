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
      

    } catch (err) {
      console.log(err);
      alert("Ulozeni se nezdarilo, asi nepodporovany prohlizec");
    }
  }

  async function loadColor() {
    
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
