import { useState } from 'react'
import './App.css'
import ColorSlider from './ColorSlider';

function App() {
  //aktualni stav red, green, blue
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  function saveColor() {
    //objekt s daty
    const data = { red, green, blue };
    //data prevedu na JSON string
    const json = JSON.stringify(data, null, "\t");
    //zabalime JSON string do binarnich dat
    const blob = new Blob([json], { type: "application/json"});
    //ted blob existuje v pameti prohlizece -> vygeneruju k nemu url
    const url = URL.createObjectURL(blob);
    //vytvorime "fake-odkaz"
    const odkaz = document.createElement("a");
    //odkazu nastavime href
    odkaz.href = url;
    //odkazu nastavime i jmeno
    odkaz.download = "barva.json";
    //odkaz pridame do stranky
    document.body.appendChild(odkaz);
    //na odklaz klikneme
    odkaz.click();
    //odkaz vyhodime ze stranky
    document.body.removeChild(odkaz);
    //uvolnime pamet od blobu
    URL.revokeObjectURL(url);
  }

  async function loadColor() {
    try {
      //vytvorime "fake" input
      const input = document.createElement("input");
      //input nastavime typ na file
      input.type = "file";
      //nastavime jako prijmany typ souboru pouze JSON
      input.accept = "application/json";

      const file = await new Promise((resolve, reject) => {
        function getFile(event) {
          const selectedFile = event.target.files[0];
          if(selectedFile) resolve(selectedFile);
          else reject(new Error("Nebyl vybran soubor"));
        }
        //nastavime inputu udalost po zmene
        input.addEventListener("change", getFile);
        //klikneme na stahnout
        input.click();
      });

      //precteme soubor jako dlouhy string
      const text = await file.text();
      //precteme / zparsujeme text jako JSON
      const data = JSON.parse(text);

      //nastavime barevne slozky podle hodnot z dat
      setRed(data.red ?? 0);
      setGreen(data.green ?? 0);
      setBlue(data.blue ?? 0);

    } catch(err) {
      console.log(err);
      alert("Nebyl vybran zadny soubor");
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