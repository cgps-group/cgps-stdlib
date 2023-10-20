import PropTypes from "prop-types";
import React from "react";

import styles from "./hint-message.module.css";

const HintMessage = (props) => {
  return (
    <div className={styles.root}>
      <div className={styles.message}>
        {props.message}
        {props.children}
      </div>
    </div>
  );
};

HintMessage.displayName = "HintMessage";

HintMessage.propTypes = {
  children: PropTypes.node,
  message: PropTypes.node,
};

export default HintMessage;
