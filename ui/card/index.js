import React from "react";
import PropTypes from "prop-types";
import CardActions from "@mui/material/CardActions";
import MuiCard from "@mui/material/Card";

import styles from "./index.module.css";

function Card(props) {
  return (
    <MuiCard
      className={styles.root}
      variant="outlined"
    >
      {props.children}
    </MuiCard>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

function PrimaryActions(props) {
  return (
    <CardActions
      className={styles["main-actions"]}
      disableSpacing
      variant="outlined"
    >
      {props.children}
    </CardActions>
  );
}

PrimaryActions.propTypes = {
  children: PropTypes.node.isRequired,
};

Card.PrimaryActions = PrimaryActions;

export default Card;
