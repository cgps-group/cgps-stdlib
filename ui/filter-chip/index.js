import React from "react";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import styles from "./index.module.css";

function FilterChip(props) {
  return (
    <Chip
      className={styles.root}
      label="Clickable Deletable"
      variant="outlined"
      onClick={props.onClick}
      onDelete={props.onClick}
      deleteIcon={<ArrowDropDownIcon />}
    >
      {props.children}
      <ArrowDropDownIcon />
    </Chip>
  );
}

FilterChip.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FilterChip;
