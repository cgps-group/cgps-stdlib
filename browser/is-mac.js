export default function isMac() {
  return (
    (typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0)
  );
}
