import React from "react";
import LinearProgress from "@mui/material/LinearProgress";

import styles from "./index.module.css";

function LoadingBar() {
  return (
    <LinearProgress
      className={styles.root}
      color="primary"
      variant="indeterminate"
    />
  );
}

export default LoadingBar;
