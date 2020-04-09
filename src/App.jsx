import React, { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";
import { CssBaseline, ThemeProvider, Container } from "@material-ui/core";
import theme from "./theme";
import Filter from "./Filter";
import Chart from "./Chart";
import Title from "./Title";
import Footer from "./Footer";

const App = () => {

  let filters, onChange;
  // if(window.location.hash.length > 1){
  //   let changeState;
  //   [filters, changeState] = useState(atob(window.location.hash.split("#")[1]).split("/"))
  //   onChange = (newFilters) => {
  //     changeState(newFilters);
  //     window.location.hash = '#'+btoa(newFilters.join("/").replace(/\/+$/, ""));
  //   }
  // } else {
  //   [filters, onChange] = useLocalStorage("filters", []);
  // }

  const [storedFilters, storedChange] = useLocalStorage("filters", []);
  const unwrapHash = (hash) => {
    try {
      return atob(hash.split("#")[1]).split("/")
    } catch(err) {
      return [];
    }
  }
  const wrapHash = (filters) => {
    return '#'+btoa(filters.join("/").replace(/\/+$/, ""));
  }
  const [importFilters, importChange] = useState(unwrapHash(window.location.hash))
  const hashChange = (newFilters) => {
    importChange(newFilters);
    window.location.hash = wrapHash(newFilters)
  }
  const [importMode, setImportMode] = useState((window.location.hash.length>0))
  if(importMode){
    filters = importFilters;
    onChange = hashChange;
  } else {
    filters = storedFilters;
    onChange = storedChange;
    window.location.hash = "";
  }

  const sanitizedInputFilters = useMemo(
    () =>
      Array.from({ length: 13 }).map((v, i) =>
        String(Number(filters[i]) || "")
      ),
    [filters]
  );

  const sanitizedFilters = useMemo(
    () => filters.map((v) => Number(v) || undefined),
    [filters]
  );

  useEffect(() => {
    if (!Array.isArray(filters)) {
      onChange([]);
    }
  }, [filters]);

  // Avoid errors
  if (!Array.isArray(filters)) return null;

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Title />
          <Filter filters={sanitizedInputFilters} onChange={onChange} importMode={importMode} clearImport={()=>{setImportMode(false)}}/>
          <Chart filter={sanitizedFilters} />
          <Footer />
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
