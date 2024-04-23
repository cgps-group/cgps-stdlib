import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

import styles from "./index.module.css";

function ErrorDetails(props) {
  return (
    <React.Fragment>
      {
        props?.error?.message && (
          <Typography
            className={styles["error-message"]}
            color="error"
          >
            {props.error.message}
          </Typography>
        )
      }
      {
        props?.error?.stack && (
          <Typography element="pre" textAlign={"left"} variant="body2" sx={{
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            backgroundColor: '#f5f5f5',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}>
            {props.error.stack}
          </Typography>
        )
      }
    </React.Fragment>
  );
}

ErrorDetails.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.node,
    stack: PropTypes.string,
  }),
};

/**
 * A simple error component that displays a generic error message by default
 *
 * When in development mode, it also display the error message and stack trace
 */
function DisplayError(props) {
  return (
    <div>
      {!!props.message && (
        <Typography
          color="textSecondary"
          variant={props.variant}
        >
          {props.message}
        </Typography>)}
      {
        process.env.NODE_ENV === "development" && (
          <ErrorDetails error={props.error} />
        )
      }
    </div>
  );
}

DisplayError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    stack: PropTypes.string,
  }),
  message: PropTypes.node,
  variant: PropTypes.string,
};

DisplayError.defaultProps = {
  message: "Sorry, something went wrong. Please try again later",
  variant: "h5",
};

export default DisplayError;
