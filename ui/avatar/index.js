import Avatar from "@mui/material/Avatar";
import gravatar from "gravatar";
import PropTypes from "prop-types";
import React from "react";
import stc from "string-to-color";

const Gravatar = (props) => (
  <Avatar
    title={props.title === false ? undefined : `Gravatar of ${props.email}`}
    src={gravatar.url(props.email)}
  />
);

Gravatar.propTypes = {
  email: PropTypes.string.isRequired,
  title: PropTypes.bool,
};

const StringAvatar = (props) => {
  const [firstName, secondName] = props.string.split(" ") || [props.string, ""];
  const firstLetter = firstName[0];
  const secondLetter = secondName?.[0] || "";
  return (
    <Avatar
      title={props.title === false ? undefined : props.string}
      style={{ bgcolor: stc(props.string) }}
    >
      {`${firstLetter.toUpperCase()}${secondLetter.toUpperCase()}`}
    </Avatar>
  );
};

StringAvatar.propTypes = {
  title: PropTypes.bool,
  string: PropTypes.string.isRequired,
};

const UiAvatar = (props) => {
  const hasGravatar = props.email && gravatar.profile_url(props.email);

  if (!props.email && !props.name) {
    return null;
  }
  return (
    hasGravatar
      ? (
        <Gravatar
          title={props.title}
          email={props.email}
        />
      )
      : (
        <StringAvatar
          title={props.title}
          string={props.email || props.name}
        />
      )
  );
};

UiAvatar.propTypes = {
  email: PropTypes.string,
  title: PropTypes.bool,
  name: PropTypes.bool,
};

export default UiAvatar;
