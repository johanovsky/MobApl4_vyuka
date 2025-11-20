import { useState } from 'react'
import './App.css'
import ColorSlider from './ColorSlider';

function App() {
  //barevne slozky RGB
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  async function saveColor() 
  {
    //vytvorim si objekt s daty
    const data = {red, green, blue};
    //data prevedu na string
    const json_string = JSON.stringify(data, null, "\t");
    //data "zabalime" jako binarni soubor Binary Large Object
    const blob = new Blob([json_string], {type: "application/json"});
    //vyrobime odkaz na soubor v pameti prohlizece
    const url = URL.createObjectURL(blob);
    //vytvorime "fake-odkaz" na blob 
    const odkaz = document.createElement("a");
    odkaz.href = url;
    //navrhneme jmeno
    odkaz.download = "barva.json";
    //vlozime odkaz do stranky
    document.body.appendChild(odkaz);
    //"klikneme" na odkaz ke stazeni
    odkaz.click();
    //hned zase odkaz ze stranky odebereme
    document.body.removeChild(odkaz);
    //uvolnime blob z pameti
    URL.revokeObjectURL(url);
  }

  async function loadColor() 
  {
    try 
    {
      //vytvorime "fake" input
      const input = document.createElement("input");
      //nastavime mu typ file
      input.type = "file";
      //nastavime file-pickeru, ze bereme jen json-files
      input.accept = "application/json";
      //zavolame funkci, ktera vrati Promise, ktera vrati vybrany soubor
      const file = await new Promise((resolve, reject) => {
        function fileSelect(event) {
          const selectedFile = event.target.files[0];
          if(selectedFile != null) resolve(selectedFile);
          else reject(new Error("Nebyl vybran soubor"));
        }
        //nastavime file inputu - posluchace
        input.addEventListener("change", fileSelect);
        //"tukneme" na nacist
        input.click();
      });
      //precteme soubor jako dlouhy string
      const text = await file.text();
      //precteme string jako JSON 
      const data = JSON.parse(text);
      //nastavime barvy
      setRed(data.red ?? 0);
      setGreen(data.green ?? 0);
      setBlue(data.blue ?? 0);

    } 
    catch (err)
    {
      console.log(err);
      alert("Nacteni se nezdarilo");
    }
  }

  return (
    <>
      <h1>React ColorMixer</h1>

      {/* Div na vybarvovani */}
      <div id="color_box" style={{backgroundColor: "rgb(" + red + ", " + green + ", " + blue + ")"}}></div>

      {/* Tady budou posuvniky */}
      <ColorSlider label="Red" value={red} func={setRed} />
      <ColorSlider label="Green" value={green} func={setGreen} />
      <ColorSlider label="Blue" value={blue} func={setBlue} />

      {/* Tady budou tlacitka */}
      <button onClick={saveColor}>Uložit barvu</button>&nbsp;&nbsp;
      <button onClick={loadColor}>Načíst barvu</button>
    </>
  )
}

export default App
