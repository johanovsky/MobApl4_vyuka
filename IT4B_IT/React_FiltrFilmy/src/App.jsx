import { useEffect, useState } from 'react'
import './App.css'
import {
  Container
} from "@mui/material";

function App() {

  //link na REST-API
  const API_URL = "https://www.johanovsti.eu/RestAPI/api.php/filmy";
  //pole pro nacteni vsech dat
  const [data, setData] = useState([]);

  //filtrovani
  const [hledJmeno, setHledJmeno] = useState("");
  const [hledZanr, setHledZanr] = useState("");

  //budeme potreboavat pole unikatnich zanru
  const [uniqZanry, setUniqZanry] = useState([]);

  useEffect(() => {
    fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      setData(data);

      //mam vsechna data -> vyfiltrujeme zanry
      const zanry = [... new Set(data.map((item) => item.zanr))];
      setUniqZanry(zanry);
    })
    .catch((error) => console.log("Nezdarilo se stahnout data: ", error));
  }, []) ;

  //funkce ktera vytahne vyfiltrovana data z vsech
  const getFilteredData= () => {
    return data.filter((item) => {
      //filtrovani nazvu filmu podle txt pole
      const obsahujeNazev = 
        item.nazev.toLowerCase().includes(hledJmeno.toLowerCase());

      //filtrovani podle zanru
      let maZanr = true;
      if(hledZanr !== "") {
        maZanr = (item.zanr === hledZanr);
      }

      //vysledek musi odpovidat obema filtrum
      return (obsahujeNazev && maZanr);
    })
  };

  return (
    <Container>
      <h1>React Filter Filmy</h1>
      
    </Container>
  )
}

export default App
