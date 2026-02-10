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
  const content = (
    props.active
      ?
      (
      <React.Fragment>
        { props.showLabelWhenActive && props.label }
        { props.showLabelWhenActive && (<React.Fragment>&nbsp;</React.Fragment>) }
        { props.children }
      </React.Fragment>
      )
      :
      (
      <React.Fragment>
        { props.label }
        { props.onClick && (<ArrowDropDownIcon className={styles["arrow-down-icon"]} />) }
      </React.Fragment>
      )
  );
  return (
    <Chip
      ref={ref}
      className={styles.root}
      label={content}
      title={props.label}
      variant={props.active ? "filled" : "outlined"}
      onClick={props.onClick}
      onDelete={props.active ? props.onReset : undefined}
      deleteIcon={props.active ? (<DeleteIcon />) : undefined}
    >
    </Chip>
  );
});

FilterChip.displayName = "FilterChip";

FilterChip.propTypes = {
  showLabelWhenActive: PropTypes.bool,
  active: PropTypes.bool,
  children: PropTypes.node,
  label: PropTypes.node,
  onClick: PropTypes.func,
  onReset: PropTypes.func,
};

export default FilterChip;
