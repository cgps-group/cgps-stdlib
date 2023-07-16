import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";

import styles from "./index.module.css";

function GridCard(props) {
  return (
    <Card
      className={styles.card}
      variant="outlined"
    >
      {props.children}
    </Card>
  );
}

GridCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GridCard;
