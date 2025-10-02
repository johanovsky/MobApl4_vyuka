import { useEffect, useState } from 'react'
import './App.css'
import { Box, Container, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, 
  TableCell, TableContainer, TableHead, TablePagination, TableRow, 
  TableSortLabel, 
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

  //usestates kvuli razeni
  const [orderBy, setOrderBy] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");

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

  //Metoda pro vytahnuti casti dat ze vsech
  const getFilterredDataSlice = () => {
    //vytahnu vsechna data
    const all = getFilterredData();

    //radime - pokud je pozadovano
    all.sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";

      const obeJsouCisla = (!isNaN(aVal) && !isNaN(bVal));

      if(obeJsouCisla) {
        //budeme radit jako cisla
        return orderDirection === "asc" 
          ? (Number(aVal) - Number(bVal))
          : (Number(bVal) - Number(aVal));
      } else {
        //budeme radit jako retezce
        return orderDirection === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      }


    });

    //vyriznu z nich aktualni cast dat
    return all.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }

  //metoda pro zmenu stránky
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  //metoda pro zmenu poctu zaznamu na strance
  const handleChangeRowsPerPage = (event) => {
    setRowsPage(parseInt(event.target.value, 10));
    setPage(0); //reset na  stranku
  }

  //metoda pro zmenu sloupce, nebo smeru razeni
  const handleSort = (column) => {
    //nastavime sloupec podle ktereho budeme radit
    setOrderBy(column);

    const isAsc = ((orderBy === column) && (orderDirection === "asc"));
    setOrderDirection(isAsc ? "desc" : "asc");
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
            {getFilterredDataSlice().map((item) => (
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
