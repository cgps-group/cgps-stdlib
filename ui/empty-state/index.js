import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

import styles from "./index.module.css";

function EmptyState(props) {
  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        {props.icon}
      </div>
      <Typography
        variant="h5"
        color="textSecondary"
      >
        {props.message}
      </Typography>
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  message: PropTypes.node,
};

EmptyState.defaultProps = {
  icon: (<WorkOutlineIcon />),
};

export default EmptyState;
