import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import cc from "classcat";

import styles from "./index.module.css";

function LoadingBar() {
  return (
    <LinearProgress
      className={cc([
        styles.root,
        "cgps-ui-loading-bar",
      ])}
      color="primary"
      variant="indeterminate"
    />
  );
}

export default LoadingBar;
