import { useEffect, useState } from 'react'
import './App.css'

function App() {
  
  //link na REST-API
  const API_URL = "https://www.johanovsti.eu/RestAPI/api.php/filmy";
  //pole pro nacteni vsech dat
  const [data, setData] = useState([]);

  //kvuli filtrovani
  //v nazvech filtrujeme pres text. pole
  const [hledNazev, setHledNazev] = useState("");
  //v zanrech filtrujeme pres select
  const [hledZanr, setHledZanr] = useState("");

  //budeme potrebovat pole unik. zanry
  //Sula (copilot) za 1
  const [uniqZanry, setUniqZanry] = useState([]);

  //Nacteni dat z API do pole dat
  useEffect(() => {
    fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      setData(data);
      //vytahnu si do pole unikatni zanry
      const zanry = [...new Set(data.map((item) => item.zanry))];
      setUniqZanry(zanry);
    })
    .catch((error) => console.error("Chyba pri nacteni dat: ", error));
  }, []);

  //funkce ktera vytahne vyfiltrovana data ze vsech
  const getFilterredData = () => {
    return data.filter((item) => {
      //filtrovani podle nazvu
      const obsahujeNazev = item.nazev.toLowerCase().includes(hledNazev.toLocaleLowerCase());

      //filtrovani podle zanru
      let maZadanyZanr = true;
      if(hledZanr !== "") {
        maZadanyZanr = (item.zanr === hledZanr);
      }

      //vysledek musi odpovidat obema filtrum naraz
      return (obsahujeNazev && maZadanyZanr);
    });
  };

  return (
    <div>
      <h1>Filtr filmu</h1>      
    </div>
  )
}

export default App
