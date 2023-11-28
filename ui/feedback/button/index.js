import PropTypes from "prop-types";
import React from "react";
import Button from "@mui/material/Button";
import FeedbackTwoToneIcon from "@mui/icons-material/FeedbackTwoTone";

import styles from "./button.module.css";

function handleOnClick() {
  document.querySelector("button#open-feedback-button")?.click();
}

function FeedbackButton(props) {
  return (
    <Button
      className={styles.root}
      onClick={handleOnClick}
      startIcon={<FeedbackTwoToneIcon />}
    >
      {props.label}
    </Button>
  );
}

FeedbackButton.propTypes = {
  label: PropTypes.string,
};

FeedbackButton.defaultProps = {
  label: "Send Feedback",
};

export default FeedbackButton;
