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
        props.hasRemoveAccess && (
          <Divider />
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
                    (share.kind === "user") && (
                      <RolesSelect
                        onChange={(newRole) => {
                          if (newRole === "remove-access") {
                            handleRemoveAccess(share.email);
                          }
                          else {
                            props.onRoleChange(share.email, newRole, props.shares);
                          }
                        }}
                        roles={props.roles}
                        value={share.role}
                        hasRemoveAccess
                      />
                    )
                  }
                  {
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
                  }
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
                    props.onSendInvitation(emails, role)
                      .then(() => {
                        setEmails([]);
                        enqueueSnackbar("Invitation email has been sent", { variant: "success" });
                      })
                      .catch((err) => {
                        enqueueSnackbar(err.message, { variant: "error" });
                      })
                      .then(() => setSendingStatus(false));
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

    </Paper>
  );
};

ProjectAccessSharingSection.propTypes = {
  defaultRole: PropTypes.string.isRequired,
  emailsDataHook: PropTypes.func.isRequired,
  onRevokeInvitation: PropTypes.func.isRequired,
  onSendInvitation: PropTypes.func.isRequired,
  roleLabel: PropTypes.string.isRequired,
  roles: PropTypes.array.isRequired,
  shares: PropTypes.array.isRequired,
};

ProjectAccessSharingSection.defaultProps = {
};

export default ProjectAccessSharingSection;
