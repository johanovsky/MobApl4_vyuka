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

      
    } catch(err) {
      console.log(err);
      alert("Ulozeni se nezdarilo, asi nepodporovany prohlizec");
    }
  }

  async function loadColor() {
    
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
