function nextTick(
  callback,
  delay = 0,
) {
  setTimeout(
    callback,
    delay,
  );
}

export default nextTick;
