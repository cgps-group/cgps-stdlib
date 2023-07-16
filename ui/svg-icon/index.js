import React from "react";
import PropTypes from "prop-types";
import MuiSvgIcon from "@mui/material/SvgIcon";

const SvgIcon = React.memo(
  ({ children, ...rest }) => (
    <MuiSvgIcon {...rest}>
      <path d={children} />
    </MuiSvgIcon>
  ),
);

SvgIcon.propTypes = {
  children: PropTypes.node,
};

SvgIcon.displayName = "UiSvgIcon";

export default SvgIcon;
