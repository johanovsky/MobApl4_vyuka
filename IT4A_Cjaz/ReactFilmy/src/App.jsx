import { useEffect, useState } from 'react'
import './App.css'
import { Box, Container, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, 
  TableCell, TableContainer, TableHead, TablePagination, TableRow, 
  TextField } from '@mui/material';

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
  const [uniqZanry, setUniqZanry] = useState([]);

  //usestates kvuli strankovani
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPage] = useState(20);

  //Nacteni dat z API do pole dat
  useEffect(() => {
    fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      setData(data);
      //vytahnu si do pole unikatni zanry
      const zanry = [...new Set(data.map((item) => item.zanr))];
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

  //Funkce ktera spocita pocet vyfiltrovanych zaznamu ze vsech dat
  function getFilterredDataCount() {
    return getFilterredData().length;
  }

  return (
      <Container>
      <h1>Filtr filmu</h1>

      {/* Filtry */}

      <Box sx={{display: "flex", gap: 1, mb: 4}}>

        <TextField
          label="Hledat podle názvu"
          value={hledNazev}
          onChange={(e) => setHledNazev(e.target.value)}
        />

        <FormControl sx={{minWidth: 160}}>
          <InputLabel>Filtrovat podle žánru</InputLabel>
          <Select
            label="Filtrovat podle žánru"
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

      {/* Tabulka */}

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
            {getFilterredData().map((item) => (
              <TableRow>
                <TableCell>{item.nazev}</TableCell>
                <TableCell>{item.rok}</TableCell>
                <TableCell>{item.zanr}</TableCell>
                <TableCell>{item.hodnoceni}</TableCell>
                <TableCell>{item.delka}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <TablePagination 
        component="div"
        count={getFilterredDataCount()}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
      />


      </Container>
  )
}

export default App
