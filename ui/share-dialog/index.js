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
              ({ data: projectAccessData }) => {
                return (
                  <React.Fragment>
                    <ProjectAccessLinkSection
                      hasAlias={props.hasAlias}
                      linkLabel={props.linkLabel}
                      linkUrl={projectAccessData.linkUrl}
                    />

                    <ProjectAccessLevelSection
                      label={props.accessLabel}
                      onChange={props.onAccessChange}
                      options={props.accessOptions}
                      value={projectAccessData.accessLevel}
                    />

                    <ProjectAccessSharingSection
                      emailsDataHook={props.shareEmailsDataHook}
                      onRevokeInvitation={props.onRevokeInvitation}
                      onSendInvitation={props.onSendInvitation}
                      shares={projectAccessData.shares}
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
  shareEmailsDataHook: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

ProjectAccessDialog.defaultProps = {
  title: "Share with People",
};

export default ProjectAccessDialog;
