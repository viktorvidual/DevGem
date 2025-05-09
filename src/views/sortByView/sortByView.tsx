import { Dispatch, SetStateAction, useState } from "react";
import { FormControl, MenuItem, Select, InputLabel, SelectChangeEvent } from "@mui/material";

interface Props {
  setSortBy: Dispatch<SetStateAction<string>>
}
export default function SortByView({setSortBy}: Props) {
  const [sortBy, setSortByForForm] = useState('');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSortByForForm(event.target.value);
    setSortBy(event.target.value);
  };

  return (
    <FormControl style={{width: '150px'}}>
      <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={sortBy}
        label="Sort By"
        onChange={handleChange}
      >
        <MenuItem value={"Name"}>Name (a-z)</MenuItem>
        <MenuItem value={"Creator"}>Creator (a-z)</MenuItem>
        <MenuItem value={"Tags"}>Tags (a-z)</MenuItem>
        <MenuItem value={"Number of downloads(Asc)"}>Number of downloads(Asc)</MenuItem>
        <MenuItem value={"Number of downloads(Desc)"}>Number of downloads(Desc)</MenuItem>
        <MenuItem value={"Upload date(Asc)"}>Upload date(Asc)</MenuItem>
        <MenuItem value={"Upload date(Desc)"}>Upload date(Desc)</MenuItem>
      </Select>
    </FormControl>
  );
}
