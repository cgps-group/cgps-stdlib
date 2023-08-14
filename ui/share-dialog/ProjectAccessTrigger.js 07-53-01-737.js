/* eslint-disable class-methods-use-this */

import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import React from "react";
import dynamic from "next/dynamic";

import UiLoadingBar from "./UiLoadingBar";
import ManageAccountsIcon from "./ManageAccountsIcon";

import * as DataHooks from "../utils/data-hooks";

const ProjectAccessDialog = dynamic(
  () => import("./ProjectAccessDialog"),
  {
    loading: UiLoadingBar,
    ssr: false,
  },
);

class ProjectAccessTrigger extends React.PureComponent {

  state = {
    isDialogVisible: false,
  }

  toggleDialog = () => {
    this.setState({ isDialogVisible: !this.state.isDialogVisible });
  }

  render() {
    const { props, state } = this;

    return (
      <React.Fragment>
        <IconButton
          title="Edit Project Access"
          onClick={this.toggleDialog}
        >
          <ManageAccountsIcon />
        </IconButton>

        {
          state.isDialogVisible && (
            <ProjectAccessDialog
              onClose={props.onDialogClose}
              projectId={props.projectId}
            />
          )
        }

      </React.Fragment>
    );
  }

}

ProjectAccessTrigger.propTypes = {
  onDialogClose: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

ProjectAccessTrigger.defaultProps = {
};

export default ProjectAccessTrigger;
