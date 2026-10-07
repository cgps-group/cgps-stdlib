import React from "react";

import styles from "./icon-button.module.css";

function IconButton({ label, children, className = "", badge, onClick }) {
  return (
    <button
      className={`${styles["icon-button"]} ${className}`}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
      {badge ? <span className={styles["notification-badge"]}>{badge}</span> : null}
    </button>
  );
}

export default IconButton;
