import ArrowDropDownTwoToneIcon from "@mui/icons-material/ArrowDropDownTwoTone";
import Chip from "@mui/material/Chip";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import UiPopoverMenu from "../popover-menu/index.js";

import styles from "./controls-menu.module.css";

class UiControlsMenu extends React.PureComponent {

  menuRef = React.createRef();

  open = () => {
    this.menuRef.current.open();
  }

  close = () => {
    this.menuRef.current.close();
  }

  popoverMenuButtonProps = () => {
    const { props } = this;

    return {
      className: classnames(
        styles["ui-controls-menu-trigger"],
        props.className,
      ),
      icon: <ArrowDropDownTwoToneIcon />,
      label: props.summary || props.title,
      // onClick: () => this.menuRef.current.open(),
      onDelete: props.onClear || undefined,
      size: "small",
      // variant: "outlined",
      color: (props.onClear ? "primary" : undefined),
      style: props.style,
    };
  }

  render() {
    const { props } = this;

    return (
      <UiPopoverMenu
        button={props.buttonComponent || Chip}
        buttonProps={this.popoverMenuButtonProps()}
        className={
          classnames(
            styles["ui-controls-menu"],
            "ui-controls-menu",
            props.className
          )
        }
        direction="right"
        disableCloseButton={props.disableHeader}
        disableHeader={props.disableHeader}
        onClose={props.onClose}
        onOpen={props.onOpen}
        ref={this.menuRef}
        title={props.title}
      >
        { props.children }
      </UiPopoverMenu>
    );
  }

}

UiControlsMenu.displayName = "ControlsMenu";

UiControlsMenu.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disableHeader: PropTypes.bool,
  fixedSize: PropTypes.bool,
  hideOnClick: PropTypes.bool,
  onClear: PropTypes.oneOfType([
    PropTypes.oneOf([ false ]),
    PropTypes.func,
  ]),
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  style: PropTypes.object,
  summary: PropTypes.node,
  title: PropTypes.node.isRequired,
};

export default UiControlsMenu;
