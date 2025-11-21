import { useState } from 'react'
import './App.css'
import ColorSlider from './ColorSlider';

function App() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

function saveColor() {
    //vytvorime objekt s daty
    const data = {red, green, blue};
    //prevede data do JSON
    const json = JSON.stringify(data, null, "\t");
    //zabalime json do bin. dat
    const blob = new Blob([json], {type: "application/json"});
    //na soubor vygeneruju odkaz
    const url = URL.createObjectURL(blob);
    //vytvorime "fake-odkaz"
    const odkaz = document.createElement("a");
    //odkazu nastavime href
    odkaz.href = url;
    //pojmenujeme soubor
    odkaz.download = "barva.json";
    //vlozime odkaz do stranky
    document.body.appendChild(odkaz);
    //klikneme na stahnout
    odkaz.click();
    //odkaz hned zase odebereme
    document.body.removeChild(odkaz);
    //uvolnime blob z pameti
    URL.revokeObjectURL(url);
  }

  async function loadColor() {
    try {
      //vytvorime "fake" file input
      const input = document.createElement("input");
      //nastavime inputu typ: file
      input.type = "file";
      //nastavime inputu typ prijimanych souboru - volitelne
      input.accept = "application/json";

      const file = await new Promise((resolve, reject) => {
        function handleFile(event) {
          const selectedFile = event.target.files[0];
          if(selectedFile) resolve(selectedFile);
          else reject(new Error("Nebyl vybran soubor"));
        }
        //pridame posluchace zmeny tomu file-input
        input.addEventListener("change", handleFile);
        //kliknu na nacist soubor
        input.click();
      });

      //precteme soubor jako dlouhy string
      const text = await file.text();
      //string precteme jako JSON soubor
      const data = JSON.parse(text);

      //muzeme z dat nacist barvy
      setRed(data.red ?? 0);
      setGreen(data.green ?? 0);
      setBlue(data.blue ?? 0);

    } catch(err) {
      console.log(err);
      alert("Nacitani se nezdarilo");
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
