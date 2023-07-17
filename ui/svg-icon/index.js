import React from "react";
import PropTypes from "prop-types";
import MuiSvgIcon from "@mui/material/SvgIcon";

const SvgIcon = React.memo(
  ({ children, path, ...rest }) => (
    <MuiSvgIcon {...rest}>
      {
        path && (<path d={path} />)
      }
      {children}
    </MuiSvgIcon>
  ),
);

SvgIcon.propTypes = {
  children: PropTypes.node,
  path: PropTypes.string,
};

SvgIcon.displayName = "UiSvgIcon";

export default SvgIcon;
