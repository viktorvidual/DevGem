import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { TextField, Button, InputAdornment, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";
import { getAllIDEs } from "../../services/IDE.services";
import { IDE } from "../../components/SelectCreatable/selectCreatableHelpers.ts";

type Props = {
  setGeneralSelectedIDE: Dispatch<SetStateAction<string>>;
}
const SearchBar = ({ setGeneralSelectedIDE }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchSelectedIDE, setSelectedIDE] = useState<string>("All platforms");
  const [allIDEs, setAllIDEs] = useState<IDE[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchIDEs() {
      try {
        const ideData = await getAllIDEs();
        setAllIDEs(ideData);
      } catch (error) {
        console.error("Error fetching IDEs:", error);
      }
    }

    fetchIDEs();
  }, []);

const handleSearch = () => {
  if (searchQuery.length > 0) {
    const encodedSearchQuery = encodeURIComponent(searchQuery);
    const encodedSearchSelectedIDE = encodeURIComponent(searchSelectedIDE);
    navigate(`/addons/search?search=${encodedSearchQuery}&searchSelectedIDE=${encodedSearchSelectedIDE}`);
    setSearchQuery("");
  }
};


return (
  <div>
    <div style={{ color: "black" }}>
      <h1
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "25px",
        }}
      >
        Find extensions to build an <br />
        app quickly and easily
      </h1>
      <h3 style={{
          fontSize: '18px',
          fontWeight: 'normal',
          marginBottom: '25px',
          color: 'grey',
        }}>Personalize your developer experience with DEV/GEM Marketplace plugins adding even more features to your favorite DEV/GEM IDE and team tools.</h3>
    </div>
    <div className="search-bar-container">
       <div className="select-bar">
        <Select
          value={searchSelectedIDE}
          onChange={(e) => {
            setSelectedIDE(e.target.value);
            setGeneralSelectedIDE(e.target.value);
          }}
          style={{border: 'none', color: 'white', backgroundColor: '#1b74e4', marginTop: '5px' , marginBottom: '5px', marginRight: '10px'}}>
          <MenuItem value="All platforms">All platforms</MenuItem>
          {allIDEs.map((ide: IDE) => (
            <MenuItem key={crypto.randomUUID()} value={ide.name}>
              {ide.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="search-bar">
        <TextField
          variant="outlined"
          fullWidth
          size="medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown  ={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={handleSearch}>
                  <SearchIcon style={{ color: "#1b74e4" }} />
                </Button>
              </InputAdornment>
            ),
          }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  </div>
);
};

export default SearchBar;
