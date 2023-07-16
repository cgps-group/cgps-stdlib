import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { debounce } from "@mui/material/utils";

import defaultStyles from "./index.module.css";
/**
 * A simple search input
 */
function Search(props) {
  return (
    <Grid
      className={defaultStyles.root}
      alignItems="flex-end"
      container
      spacing={1}
    >
      <Grid item>
        <TextField
          size="small"
          autoFocus
          id="search-input"
          placeholder="Search"
          value={props.value}
          onChange={(event) => debounce(props.onChange(event.target.value))}
          disabled={props.isDisabled}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
}

Search.propTypes = {
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

Search.defaultProps = {
  id: "search-input",
};

export default Search;
