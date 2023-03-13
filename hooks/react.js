import { useEffect } from "react";

export function useComponentDidMount(callback) {
  return useEffect(
    () => { callback(); },
    [],
  );
}
