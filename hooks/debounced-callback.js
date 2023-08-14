import React from "react";

import debounce from "lodash.debounce";

function debouncedCallback(func) {
  return React.useCallback(
    debounce(
      func,
      1000,
    ),
    [],
  );
}

export default debouncedCallback;
