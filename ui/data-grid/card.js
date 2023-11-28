import React from "react";
import PropTypes from "prop-types";
import MuiCard from "@mui/material/Card";

import styles from "./index.module.css";

function Card(props) {
  return (
    <MuiCard
      className={styles.card}
      variant="outlined"
    >
      {props.children}
    </MuiCard>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Card;
