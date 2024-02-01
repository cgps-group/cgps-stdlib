import Avatar from "@mui/material/Avatar";
import gravatar from "gravatar";
import PropTypes from "prop-types";
import React from "react";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  const [firstName, secondName] = name.split(" ") || [name, ""];
  const firstLetter = firstName[0];
  const secondLetter = secondName?.[0] || "";
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${firstLetter}${secondLetter}`,
  };
}

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

const StringAvatar = (props) => (
  <Avatar
    title={props.title === false ? undefined : props.string}
    {...stringAvatar(props.string)}
  />
);

StringAvatar.propTypes = {
  title: PropTypes.bool,
  string: PropTypes.bool,
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
