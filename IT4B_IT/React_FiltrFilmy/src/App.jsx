import { useEffect, useState } from 'react'
import './App.css'
import {
  Box,
  Container, FormControl, InputLabel, MenuItem, Paper, 
  Select, Table, TableBody, TableCell, TableContainer, 
  TableHead, TablePagination, TableRow, TableSortLabel, TextField
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

  //funkce pro nastaveni razeni
  const handleSort = (column) => {
    //nastavime sloupec podle ktereho budeme radit
    setOrderBy(column);
    //zjistime jestli uz se nahodou neradi vzestupne
    const isAsc = ((orderBy === column) && (orderDirection === "asc"));
    //jestlize se radi vzestupne, tak nyni radime sestupne
    setOrderDirection(isAsc ? "desc" : "asc");
  };

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

    //kontrolni vypis
    //console.log(all_filtered);

    //razeni
    if(orderBy) {
      all_filtered.sort((a, b) => {
        //vytahnu si dve hodnoty, ktere chci porovnat
        const aVal = a[orderBy] ?? "";
        const bVal = b[orderBy] ?? "";
        
        //kontrola jestli to jsou oboje cisla
        const bothNumbers = (!isNaN(aVal) && !isNaN(bVal));

        if(bothNumbers) {
          return orderDirection === "asc"
            ? Number(aVal) - Number(bVal)
            : Number(bVal) - Number(aVal);
        }
        
        //kdyz to nejsou cisla -> radime jako stringy
        return orderDirection === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }


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
                <TableSortLabel
                  active={orderBy === "rok"}
                  direction={orderBy === "rok" ? orderDirection : "asc"}
                  onClick={() => handleSort("rok")}
                >
                  Rok vydání
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "zanr"}
                  direction={orderBy === "zanr" ? orderDirection : "asc"}
                  onClick={() => handleSort("zanr")}
                >
                  Žánr
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "hodnoceni"}
                  direction={orderBy === "hodnoceni" ? orderDirection : "asc"}
                  onClick={() => handleSort("hodnoceni")}
                >
                  Hodnocení
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "delka"}
                  direction={orderBy === "delka" ? orderDirection : "asc"}
                  onClick={() => handleSort("delka")}
                >
                  Délka filmu
                </TableSortLabel>
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
