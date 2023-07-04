import PropTypes from "prop-types";
import React from "react";
import Typography from "@mui/material/Typography";

import UiLoadingBar from "./UiLoadingBar";

import styles from "./loading-spinner.module.css";

function UiLoadingSpinner(props) {
  return (
    <div className={styles.spinner}>
      <UiLoadingBar />
      <div>
        <img src="/images/logos/icon-spinner.gif" />
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

// LoadingSpinner.defaultProps = {
//   children: "Loading Project",
// };

export default UiLoadingSpinner;
