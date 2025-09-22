import { useEffect, useState } from 'react'
import './App.css'
import {
  Box,
  Container, FormControl, InputLabel, MenuItem, Paper, 
  Select, Table, TableBody, TableCell, TableContainer, 
  TableHead, TablePagination, TableRow, TextField
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

  //usestates pro strankovani
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  //usestates pro razeni
  const [orderBy, setOrderBy] = useState(""); //bude obsahovat jmeno sloupce podle ktereho radime
  const [orderDirection, setOrderDirection] = useState("asc"); //bude obsahovat smer razeni 

  //co se stane, kdyz zmenim stranku
  const pageChangeHandler = (event, newPage) => {
    setPage(newPage);
  }

  //co se stane, kdyz zmenim pocet zaznau na strance
  const rowsPerPageChangeHandler = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); //navrat na prvni stranku
  }

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

  //funkce ktera spocita pocet vyfiltrovanych zaznamu
  const getFilteredDataCount = () => {
    return getFilteredData().length;
  }

  //funkce ktera vyrizne ze vsech dat, jenom ta ktera se budou zobrazovat
  const getFilteredDataSlice = () => {
    //potrebuju vsechna data - uz vyfiltrovana
    const all_filtered = getFilteredData();

    //some magic to do...


    //vratime pouze vyrez z vsech
    return all_filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }

  return (
    <Container>
      <h1>React Filter Filmy</h1>

      {/* Filtrovani */}

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2}}>

        <TextField
          label="Filtrovani podle nazvu"
          value={hledJmeno}
          onChange={(e) => setHledJmeno(e.target.value)}
        />

        <FormControl sx={{minWidth: 160}}>
          <InputLabel>Žánr</InputLabel>
          <Select
            label="Žánr"
            value={hledZanr}
            onChange={(e) => setHledZanr(e.target.value)}
          >
            <MenuItem value="">Vše</MenuItem>
            {
              uniqZanry.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))
            }
          </Select>
        </FormControl>

      </Box>

      {/* Tabulka s daty */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Název
              </TableCell>
              <TableCell>
                Rok vydání
              </TableCell>
              <TableCell>
                Žánr
              </TableCell>
              <TableCell>
                Hodnocení
              </TableCell>
              <TableCell>
                Délka filmu
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              getFilteredDataSlice().map((item) => (
                <TableRow>
                  <TableCell>{item.nazev}</TableCell>
                  <TableCell>{item.rok}</TableCell>
                  <TableCell>{item.zanr}</TableCell>
                  <TableCell>{item.hodnoceni}</TableCell>
                  <TableCell>{item.delka}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Strankovani */}

      <TablePagination 
        component="div"
        count={getFilteredDataCount()}
        page={page}
        onPageChange={pageChangeHandler}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={rowsPerPageChangeHandler}
        rowsPerPageOptions={[5, 10, 20]}
      />

    </Container>
  )
}

export default App
