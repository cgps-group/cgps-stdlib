import PropTypes from "prop-types";
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FeedbackTwoToneIcon from "@mui/icons-material/FeedbackTwoTone";

import styles from "./button.module.css";

function handleOnClick() {
  document.querySelector("button#open-feedback-button")?.click();
}

function FeedbackButton(props) {
  return (
    <ListItem
      className={styles.root}
      onClick={handleOnClick}
    >
      <ListItemIcon>
        <FeedbackTwoToneIcon />
      </ListItemIcon>
      <ListItemText primary={props.label} />
    </ListItem>
  );
}

FeedbackButton.propTypes = {
  label: PropTypes.string,
};

FeedbackButton.defaultProps = {
  label: "Send Feedback",
};

export default FeedbackButton;
