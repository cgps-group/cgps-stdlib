import Avatar from "@mui/material/Avatar";
import gravatar from "gravatar";
import PropTypes from "prop-types";
import React from "react";

const UiAvatar = (props) => {
  return (
    <Avatar
      title={`Gravatar of ${props.email}`}
      src={gravatar.url(props.email)}
    />
  );
};

UiAvatar.propTypes = {
  email: PropTypes.string.isRequired,
};

export default UiAvatar;
