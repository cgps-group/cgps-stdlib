import React from "react";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./index.module.css";

function DeleteIcon(props) {
  return (
    <button
      onClick={props.onClick}
      className={styles["delete-button"]}
    >
      <ClearIcon />
    </button>
  );
}

const FilterChip = React.forwardRef((props, ref) => {
  return (
    <Chip
      ref={ref}
      className={styles.root}
      label={props.children}
      variant="filled"
      onClick={props.onClick}
      onDelete={props.onDelete}
      deleteIcon={<DeleteIcon />}
    >
    </Chip>
  );
});

FilterChip.displayName = "FilterChip";

FilterChip.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FilterChip;
