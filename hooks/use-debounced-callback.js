import React from "react";

import debounce from "lodash.debounce";

function useDebouncedCallback(func, options = {}) {
  return React.useCallback(
    debounce(
      func,
      1000,
      options
    ),
    [],
  );
}

export default useDebouncedCallback;
