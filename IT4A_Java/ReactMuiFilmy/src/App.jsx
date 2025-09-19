import { useEffect, useState } from 'react'
import './App.css'
import {
  Container, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  TableSortLabel,
} from "@mui/material";

function App() {

  //link na REST-API
  const API_URL = "https://www.johanovsti.eu/RestAPI/api.php/filmy";
  //pole pro nacteni kompletnich dat
  const [data, setData] = useState([]);

  //filtrovani
  const [hledanyNazev, setHledanyNazev] = useState("");
  const [hledanyZanr, setHledanyZanr] = useState("");

  //potrebujeme pole pro unikatni seznam zanru
  const [uniqZanry, setUniqZanry] = useState([]);

  //strankovani
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  //zmena stranky
  const changePageHandler = (event, newPage) => {
    setPage(newPage);
  }

  //zmena pocet zaznamu na strance
  const changeRowsPerPageHandler = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset aktualni stranky na 0
  }

  //razeni
  const [orderBy, setOrderBy] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");

  useEffect(() => {
    fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      setData(data);

      //vyfiltrujeme si unikatni zanry
      const zanry = [...new Set(data.map((item) => item.zanr))];
      setUniqZanry(zanry);
    })
    .catch((error) => console.log("Chyba pri cteni dat z JSON"));
  }, []);

  //funkce ktera vytahne vyfiltrovana data z vsech
  const getFilteredData = () => {
    return data.filter((item) => {
      //nazev filmu pres textove pole
      const odpovidajiciNazev = item.nazev.toLowerCase().includes(hledanyNazev.toLowerCase());

      //zanry filmu pres select
      let odpovidajiciZanr = true;
      if(hledanyZanr !== "") {
        odpovidajiciZanr = (item.zanr === hledanyZanr);
      }

      //vysledek musi odpovidat obema filtrum
      return (odpovidajiciNazev && odpovidajiciZanr);
    });
  };

  //funkce ktera spocita pocet zaznamu z filtrovanych dat
  const getFilteredDataCount = () => {
    return getFilteredData().length;
  }

  //funkce ktera vyrizne ze vsech dat jen pozadovanou cast
  const getFilteredDataSlice = () => {
    //stahnu vsechna data
    const filtered = getFilteredData();

    //seradime si je
    filtered.sort((a, b) => {
      if(!orderBy) return 0;
      const aVal = a[orderBy] || "";
      const bVal = b[orderBy] || "";

      //radime cisla
      const aNum = Number(aVal);
      const bNum = Number(bVal);

      if(!isNaN(aNum) && !isNaN(bNum)) {
        return orderDirection === "asc" ? aNum - bNum : bNum - aNum;
      }
    });

    //vykrojim pozadovany kousek
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }

  //funkce pro zmenu smeru razeni
  const sortHandle = (column) => {
    const isAsc = orderBy === column && orderDirection === "asc";
    setOrderBy(column);
    setOrderDirection(isAsc ? "desc" : "asc");
  }

  return (
    <Container>
      <h1>React MUI Filtr Filmu</h1>

      {/* Filtry */}
      <TextField
        label="Filtrovat podle názvu"
        value={hledanyNazev}
        onChange={(e) => setHledanyNazev(e.target.value)}
      />

      <FormControl sx={{minWidth: 160}}>
        <InputLabel>Žánr</InputLabel>
        <Select
          label="Zanr"
          value={hledanyZanr}
          onChange={(e) => setHledanyZanr(e.target.value)}
        >
          <MenuItem value="">Vše</MenuItem>
          {
            uniqZanry.map((item) => (
              <MenuItem value={item}>{item}</MenuItem>
            ))
          }
        </Select>
      </FormControl>

      {/* Tabulka */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Nazev
              </TableCell>
              <TableCell sortDirection={orderBy === "rok" ? orderDirection : false}>
                <TableSortLabel 
                  active={orderBy === "rok"}
                  direction={orderBy === "rok" ? orderDirection : "asc"}
                  onClick={() => sortHandle("rok")}
                />
                Rok vydani
              </TableCell>
              <TableCell>
                Zanr
              </TableCell>
              <TableCell>
                Hodnoceni
              </TableCell>
              <TableCell>
                Delka
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

      <TablePagination
        component="div"
        count={getFilteredDataCount()}
        page={page}
        onPageChange={changePageHandler}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={changeRowsPerPageHandler}
        rowsPerPageOptions={[5, 10, 20]}
      />

    </Container>
  )
}

export default App
