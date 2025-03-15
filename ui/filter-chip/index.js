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
        { props.onClick && (<ArrowDropDownIcon className={styles["down-down-icon"]} />) }
      </React.Fragment>
      )
  );
  return (
    <Chip
      ref={ref}
      className={styles.root}
      label={content}
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
  showLabelWhenActive: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  label: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  onReset: PropTypes.func,
};

export default FilterChip;
