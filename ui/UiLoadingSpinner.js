/* eslint-disable @next/next/no-img-element */

import PropTypes from "prop-types";
import React from "react";
import Typography from "@mui/material/Typography";

import UiLoadingBar from "./UiLoadingBar.js";

import styles from "./loading-spinner.module.css";

function UiLoadingSpinner(props) {
  return (
    <div className={styles.spinner}>
      <UiLoadingBar />
      <div>
        <img src="/images/spinner.gif" alt="loading spinner" />
        {
          props.children && (
            <div className={styles.title}>
              <Typography
                color="primary"
                variant="h4"
              >
                {props.children}
              </Typography>
            </div>
          )
        }
      </div>
    </div>
  );
}

UiLoadingSpinner.propTypes = {
  children: PropTypes.node,
};

export default UiLoadingSpinner;
