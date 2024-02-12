/* eslint-disable class-methods-use-this */

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@mui/material/TextField";
import { sentenceCase } from "change-case";

import { useSnackbar } from "notistack";

import UiAvatar from "cgps-stdlib/ui/avatar/index.js";
import UiSelect from "cgps-stdlib/ui/select/index.js";
import UiLoadingBar from "cgps-stdlib/ui/loading-bar/index.js";
import { Divider } from "@mui/material";

const AutocompletePopper = function (props) {
  return (
    <Popper
      {...props}
      modifiers={
        {
          preventOverflow: { enabled: false },
          flip: { enabled: false },
        }
      }
    />
  );
};

const EmailAddressesInput = (props) => {
  const { data } = props.dataHook();

  return (
    <Autocomplete
      size="small"
      disableClearable
      ListboxProps={
        { style: { maxHeight: "30vh" } }
      }
      PopperComponent={AutocompletePopper}
      multiple
      options={data || []}
      // defaultValue={[top100Films[13].title]}
      freeSolo
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option}
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={
        (params) => (
          <TextField
            {...params}
            variant="filled"
            label=""
            type="email"
            placeholder="Enter an email address to share then press enter"
          />
        )
      }
      value={props.value}
      onChange={(event, value) => props.onChange(value)}
    />
  );
};

EmailAddressesInput.propTypes = {
  projectAccessData: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

const RolesSelect = (props) => {
  return (
    <UiSelect
      label={props.label}
      onChange={
        (event) => {
          props.onChange(event.target.value);
        }
      }
      options={props.roles}
      renderValue={(item) => sentenceCase(item)}
      size="small"
      value={props.value}
      variant="outlined"
      defaultRole="viewer"
    >
      {
        (props.hasRemoveAccess || props.hasResendInvitation) && (
          <Divider />
        )
      }
      {
        props.hasResendInvitation && (
          <UiSelect.Item value="resend-invitation">
            Resend invitation
          </UiSelect.Item>
        )
      }
      {
        props.hasRemoveAccess && (
          <UiSelect.Item value="remove-access">
            Remove access
          </UiSelect.Item>
        )
      }
    </UiSelect>
  );
};

RolesSelect.propTypes = {
  hasRemoveAccess: PropTypes.bool,
  hasResendInvitation: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  roles: PropTypes.array,
  value: PropTypes.string,
};

const ProjectAccessListItem = (props) => {
  const [sendingStatus, setSendingStatus] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleRemoveAccess = (email) => {
    setSendingStatus(true);
    props.onRevokeInvitation(email)
      .then(() => {
        enqueueSnackbar("Access has been removed", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .then(() => setSendingStatus(false));
  };

  const handleSendInvitation = (emails, role) => {
    setSendingStatus(true);
    props.onSendInvitation(emails, role)
      .then(() => {
        setEmails([]);
        enqueueSnackbar("Invitation email has been resent", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .then(() => setSendingStatus(false));

  };

  return (
    <ListItem
      key={props.email}
      dense
    >
      <ListItemAvatar>
        <UiAvatar
          email={props.email}
        />
      </ListItemAvatar>
      <ListItemText
        primary={props.email}
        secondary={
          (props.kind === "user") ? `Added on ${new Date(props.createdAt).toLocaleDateString()}` :
            (props.kind === "invitation") ? `Invited on ${new Date(props.createdAt).toLocaleDateString()}` :
              null
        }
      />
      <ListItemSecondaryAction>
        {
          <RolesSelect
            onChange={(newRole) => {
              if (newRole === "remove-access") {
                handleRemoveAccess(props.email);
              }
              else if (newRole === "resend-invitation") {
                handleSendInvitation([props.email], props.role);
              }
              else {
                props.onRoleChange(props.email, newRole, props.shares);
              }
            }}
            roles={props.roles}
            value={props.role}
            hasRemoveAccess
            hasResendInvitation={props.kind === "invitation"}
          />
        }
        {/* {
          (share.kind === "invitation") && (
            <Button
              title="Resend invitation email"
              disabled={sendingStatus}
              onClick={
                () => {
                  setSendingStatus(true);
                  props.onSendInvitation([share.email], role)
                    .then(() => {
                      setEmails([]);
                      enqueueSnackbar("Invitation email has been resent", { variant: "success" });
                    })
                    .catch((err) => {
                      enqueueSnackbar(err.message, { variant: "error" });
                    })
                    .then(() => setSendingStatus(false));
                }
              }
            >
              Resend
              {sendingStatus && <CircularProgress size={24} />}
            </Button>
          )
        } */}
        {/* <IconButton
          title="Remove user"
          onClick={
            () => handleRemoveAccess(share.email)
          }
        >
          <DeleteRoundedIcon />
        </IconButton> */}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

ProjectAccessListItem.propTypes = {
  email: PropTypes.string,
  kind: PropTypes.string,
  role: PropTypes.string,
  createdAt: PropTypes.string,
  onRevokeInvitation: PropTypes.func.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  onSendInvitation: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
  shares: PropTypes.array.isRequired,
};

const ProjectAccessSharingSection = (props) => {
  const [emails, setEmails] = React.useState([]);
  const [role, setRole] = React.useState(props.defaultRole ?? props.roles?.[0]?.value);
  const [sendingStatus, setSendingStatus] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleRemoveAccess = (email) => {
    setSendingStatus(true);
    props.onRevokeInvitation(email)
      .then(() => {
        enqueueSnackbar("Access has been removed", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .then(() => setSendingStatus(false));
  };

  const handleSendInvitation = (invitationEmails, invitationRole) => {
    setSendingStatus(true);
    return props.onSendInvitation(invitationEmails, invitationRole)
      .then(() => {
        setEmails([]);
        enqueueSnackbar("Invitation email has been resent", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .then(() => setSendingStatus(false));
  };

  return (
    <Paper
      variant="outlined"
      component="section"
      className="users"
    >

      <EmailAddressesInput
        value={emails}
        onChange={setEmails}
        dataHook={props.emailsDataHook}
      />

      <List dense>
        {
          props.shares?.map(
            (share) => (
              <ListItem
                key={share.email}
                dense
              >
                <ListItemAvatar>
                  <UiAvatar
                    email={share.email}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={share.email}
                  secondary={
                    (share.kind === "user") ? `Added on ${new Date(share.createdAt).toLocaleDateString()}` :
                      (share.kind === "invitation") ? `Invited on ${new Date(share.createdAt).toLocaleDateString()}` :
                        null
                  }
                />
                <ListItemSecondaryAction>
                  {
                    <RolesSelect
                      onChange={(newRole) => {
                        if (newRole === "remove-access") {
                          handleRemoveAccess(share.email);
                        }
                        else if (newRole === "resend-invitation") {
                          handleSendInvitation([share.email], share.role);
                        }
                        else {
                          props.onRoleChange(share.email, newRole, props.shares);
                        }
                      }}
                      roles={props.roles}
                      value={share.role}
                      hasRemoveAccess
                      hasResendInvitation={share.kind === "invitation"}
                    />
                  }
                  {/* {
                    (share.kind === "invitation") && (
                      <Button
                        title="Resend invitation email"
                        disabled={sendingStatus}
                        onClick={
                          () => {
                            setSendingStatus(true);
                            props.onSendInvitation([share.email], role)
                              .then(() => {
                                setEmails([]);
                                enqueueSnackbar("Invitation email has been resent", { variant: "success" });
                              })
                              .catch((err) => {
                                enqueueSnackbar(err.message, { variant: "error" });
                              })
                              .then(() => setSendingStatus(false));
                          }
                        }
                      >
                        Resend
                        {sendingStatus && <CircularProgress size={24} />}
                      </Button>
                    )
                  } */}
                  {/* <IconButton
                    title="Remove user"
                    onClick={
                      () => handleRemoveAccess(share.email)
                    }
                  >
                    <DeleteRoundedIcon />
                  </IconButton> */}
                </ListItemSecondaryAction>
              </ListItem>
            )
          )
        }

        {
          (emails.length > 0) && (
            <div className="send-invitation">
              <RolesSelect
                label={props.roleLabel}
                onChange={setRole}
                roles={props.roles}
                value={role ?? props.defaultRole}
              />
              <Button
                color="primary"
                variant="outlined"
                onClick={() => setEmails([])}
                disabled={sendingStatus}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                disableElevation
                disabled={sendingStatus}
                onClick={
                  () => {
                    setSendingStatus(true);
                    handleSendInvitation(emails, role);
                  }
                }
              >
                Send Invitation
                {sendingStatus && <CircularProgress size={24} />}
              </Button>
            </div>
          )
        }
      </List>

      {sendingStatus && <UiLoadingBar size={24} />}
    </Paper>
  );
};

ProjectAccessSharingSection.propTypes = {
  defaultRole: PropTypes.string.isRequired,
  emailsDataHook: PropTypes.func.isRequired,
  onRevokeInvitation: PropTypes.func.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  onSendInvitation: PropTypes.func.isRequired,
  roleLabel: PropTypes.string.isRequired,
  roles: PropTypes.array.isRequired,
  shares: PropTypes.array.isRequired,
};

ProjectAccessSharingSection.defaultProps = {
};

export default ProjectAccessSharingSection;
