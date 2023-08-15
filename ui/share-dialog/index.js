import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";

import UiDialog from "../dialog/index.js";

import UiDataHook from "../data-hook/index.js";

import { root as dialogClassname } from "./project-dialog.module.css";
import { root as rootClassname } from "./project-access-dialog.module.css";

import ProjectAccessLevelSection from "./ProjectAccessLevelSection.js";
import ProjectAccessSharingSection from "./ProjectAccessSharingSection.js";
import ProjectAccessLinkSection from "./ProjectAccessLinkSection.js";

class ProjectAccessDialog extends React.PureComponent {

  state = {
    access: null,
  }

  render() {
    const { props } = this;

    return (
      <UiDialog
        className={clsx(rootClassname, dialogClassname)}
        onClose={props.onClose}
        isOpen
        title={props.title}
      >
        <div className="full-content">
          <UiDataHook
            dataHook={props.dataHook}
          >
            {
              ({ data: accessData, mutate }) => {
                return (
                  <React.Fragment>
                    <ProjectAccessLinkSection
                      hasAlias={props.hasAlias}
                      linkLabel={props.linkLabel}
                      linkUrl={accessData.linkUrl}
                    />

                    <ProjectAccessLevelSection
                      label={props.accessLabel}
                      onChange={props.onAccessChange}
                      options={props.accessOptions}
                      value={accessData.accessLevel}
                    />

                    <ProjectAccessSharingSection
                      roles={props.shareRoles}
                      emailsDataHook={props.shareEmailsDataHook}
                      onSendInvitation={async (emails, role) => {
                        await props.onSendInvitation(emails, role);
                        mutate();
                      }}
                      onRevokeInvitation={async (email, kind) => {
                        await props.onRevokeInvitation(email, kind);
                        mutate();
                      }}
                      onRoleChange={
                        (email, role) => {
                          const newAccessData = { ...accessData };
                          newAccessData.shares = [...accessData.shares];
                          const shareIndex = newAccessData.shares.findIndex((x) => x.email === email);
                          newAccessData.shares[shareIndex] = {
                            ...newAccessData.shares[shareIndex],
                            role,
                          };
                          mutate(newAccessData, { optimisticData: true, revalidate: false });
                          props.onShareRoleChange(email, role);
                        }
                      }
                      shares={accessData.shares}
                    />
                  </React.Fragment>
                );
              }
            }
          </UiDataHook>
        </div>
      </UiDialog>
    );
  }

}

ProjectAccessDialog.propTypes = {
  accessLabel: PropTypes.string,
  accessOptions: PropTypes.array.isRequired,
  dataHook: PropTypes.func.isRequired,
  hasAlias: PropTypes.bool,
  linkLabel: PropTypes.string,
  onAccessChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRevokeInvitation: PropTypes.func.isRequired,
  onSendInvitation: PropTypes.func.isRequired,
  onShareRoleChange: PropTypes.func.isRequired,
  shareEmailsDataHook: PropTypes.func.isRequired,
  shareRoles: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

ProjectAccessDialog.defaultProps = {
  title: "Share with People",
};

export default ProjectAccessDialog;
