/* eslint-disable class-methods-use-this */

import Link from "next/link";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import React from "react";

import UiAvatar from "cgps-stdlib/ui/avatar/index.js";

function UserAvatar(props) {
  const { href, ...rest } = props;
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <Link
        href={href}
      >
        <a {...rest}>
          <UiAvatar
            email={session.user.email}
            title={false}
          />
        </a>
      </Link>
    );
  }

  // eslint-disable-next-line @next/next/no-html-link-for-pages
  return (<a href="/api/auth/signin">Sign in</a>);
}

UserAvatar.propTypes = {
  defaultRole: PropTypes.string.isRequired,
  emailsDataHook: PropTypes.func.isRequired,
  onRevokeInvitation: PropTypes.func.isRequired,
  onSendInvitation: PropTypes.func.isRequired,
  roleLabel: PropTypes.string.isRequired,
  roles: PropTypes.array.isRequired,
  shares: PropTypes.array.isRequired,
};

export default UserAvatar;
