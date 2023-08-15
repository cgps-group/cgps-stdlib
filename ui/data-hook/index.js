import React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";

function UiDataHook(props) {
  const {
    children: DataView,
    dataHook,
    EmptyView,
    ErrorView,
    LoadingView,
    ...rest
  } = props;

  const {
    data,
    isError,
    isLoading,
    mutate,
  } = dataHook();

  if (isLoading || props.isLoading) {
    if (LoadingView) {
      return (<LoadingView />);
    }
    else {
      return (
        <LinearProgress
          color="primary"
          variant="indeterminate"
        />
      );
    }
  }

  if (isError) {
    if (ErrorView) {
      return (
        <ErrorView
          {...rest}
          error={isError}
        />
      );
    }
    else {
      return (
        <pre {...rest}>
          {isError.message || JSON.stringify(isError, null, 2)}
        </pre>
      );
    }
  }

  if (!data && EmptyView) {
    return (
      <EmptyView {...rest} />
    );
  }

  return (
    <DataView
      {...rest}
      mutate={mutate}
      data={data}
    />
  );
}

UiDataHook.propTypes = {
  children: PropTypes.elementType.isRequired,
  dataHook: PropTypes.func.isRequired,
  EmptyView: PropTypes.elementType,
  ErrorView: PropTypes.elementType,
  isLoading: PropTypes.bool,
  LoadingView: PropTypes.elementType,
};

export default UiDataHook;
