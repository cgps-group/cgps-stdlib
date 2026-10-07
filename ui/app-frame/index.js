import React from "react";
import PropTypes from "prop-types";
import { Provider } from "@react-spectrum/s2";
import Add from "@react-spectrum/s2/icons/Add";
import HelpCircle from "@react-spectrum/s2/icons/HelpCircle";
import Search from "@react-spectrum/s2/icons/Search";
import Settings from "@react-spectrum/s2/icons/Settings";
import clsx from "clsx";

import IconButton from "./icon-button.js";

import styles from "./index.module.css";

function getCurrentView() {
  const params = new URLSearchParams(window.location.search);
  return params.get("view") || "home";
}

function WindowBase(props) {
  const [activeNav, setActiveNav] = React.useState(getCurrentView);
  const canSearchProjects = (typeof props.onSearchChange === "function");

  const handleCreateProject = () => {
    window.appFrameAPI?.createProject();
  };

  const handleOpenHelp = () => {
    window.appFrameAPI?.openView("help");
  };

  const handleOpenHome = () => {
    window.appFrameAPI?.openView("home");
  };

  const handleOpenProject = () => {
    window.appFrameAPI?.openProjectDialog();
  };

  const handleOpenRecentProjects = () => {
    window.appFrameAPI?.openView("recent");
  };

  const handleOpenSettings = () => {
    setActiveNav("settings");
    window.appFrameAPI?.openView("settings");
  };

  return (
    <Provider background="base">
      <div
        className={
          clsx("app-frame", styles["app-frame"])
        }
      >
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <picture className={styles["brand-mark"]}>
              <source srcSet={props.logoWhite} media="(prefers-color-scheme: dark)" />
              <img src={props.logoRgb} alt="" />
            </picture>
            <span className={styles["brand-name"]}>CGPS Desktop</span>
          </div>

          <label className={styles["search-box"]}>
            <Search aria-hidden="true" />
            <input
              type="search"
              placeholder="Search recent projects"
              aria-label="Search recent projects"
              value={props.searchValue || ""}
              disabled={!canSearchProjects}
              onChange={(event) => {
                if (canSearchProjects) {
                  props.onSearchChange(event.target.value);
                }
              }}
            />
          </label>

          <div className={styles["topbar-actions"]}>
            <IconButton label="Help" onClick={handleOpenHelp}><HelpCircle /></IconButton>
          </div>
        </header>

        <aside className={styles.sidebar} aria-label="Main navigation">
          <IconButton label="Create new project" className={styles["create-button"]} onClick={handleCreateProject}><Add /></IconButton>
          <nav className={styles["nav-items"]}>
            {
              props.navItems.map(({ id, label, Icon }) => (
                <IconButton
                  key={id}
                  label={label}
                  className={`${styles["nav-button"]} ${activeNav === id ? styles["is-active"] : ""}`}
                  onClick={() => {
                    if (id === "help") {
                      setActiveNav(id);
                      handleOpenHelp();
                    }
                    else if (id === "home") {
                      setActiveNav(id);
                      handleOpenHome();
                    }
                    else if (id === "recent") {
                      setActiveNav(id);
                      handleOpenRecentProjects();
                    }
                    else if (id === "open") {
                      handleOpenProject();
                    }
                  }}
                >
                  <Icon />
                </IconButton>
              ))
            }
          </nav>
          <IconButton
            label="Settings"
            className={`${styles["sidebar-toggle"]} ${activeNav === "settings" ? styles["is-active"] : ""}`}
            onClick={handleOpenSettings}
          >
            <Settings />
          </IconButton>
        </aside>

        <main
        className={styles.workspace} aria-label={`${activeNav} workspace`}>
          { props.children }
        </main>
      </div>
    </Provider>
  );
}

WindowBase.propTypes = {
  children: PropTypes.node,
  logoRgb: PropTypes.string.isRequired,
  logoWhite: PropTypes.string.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      Icon: PropTypes.elementType.isRequired,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSearchChange: PropTypes.func,
  searchValue: PropTypes.string,
};

export default WindowBase;
