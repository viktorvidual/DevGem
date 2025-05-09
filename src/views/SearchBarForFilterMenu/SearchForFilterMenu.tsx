import { useState } from "react";
import { TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchForFilterMenu.css";

const SearchBarForFilterMenu = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
    setSearchQuery('');
  };

  return (
    <>
      <div className="search-bar-container">
        <div className="search-bar">
          <TextField
            label="Search extensions"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={handleSearch}>
                    <SearchIcon />
                  </Button>
                </InputAdornment>
              ),
            }}
            style={{ width: '100%'}}/>
        </div>
      </div>
    </>
  );
};

export default SearchBarForFilterMenu;
