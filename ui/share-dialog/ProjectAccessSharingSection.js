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

import { useSnackbar } from "notistack";

import UiAvatar from "cgps-stdlib/ui/avatar/index.js";
import UiSelect from "cgps-stdlib/ui/select/index.js";

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

const ProjectAccessSharingSection = (props) => {
  const [emails, setEmails] = React.useState([]);
  const [role, setRole] = React.useState(props.defaultRole ?? props.roles?.[0]?.value);
  const [sendingStatus, setSendingStatus] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

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
          props.shares.map(
            ({ email, kind, createdAt }) => (
              <ListItem
                key={email}
                dense
              >
                <ListItemAvatar>
                  <UiAvatar
                    email={email}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={email}
                  secondary={
                    (kind === "user") ? `Added on ${new Date(createdAt).toLocaleDateString()}` :
                      (kind === "invitation") ? `Invitation sent on ${new Date(createdAt).toLocaleDateString()}` :
                        null
                  }
                />
                <ListItemSecondaryAction>
                  {
                    (kind === "invitation") && (
                      <IconButton
                        title="Resend invitation email"
                        disabled={sendingStatus}
                        onClick={
                          () => {
                            setSendingStatus(true);
                            props.onSendInvitation([email])
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
                        <SendRoundedIcon />
                        {sendingStatus && <CircularProgress size={24} />}
                      </IconButton>
                    )
                  }
                  <IconButton
                    title="Remove user"
                    onClick={
                      () => {
                        setSendingStatus(true);
                        props.onRevokeInvitation(email, kind)
                          .then(() => {
                            enqueueSnackbar("Invitation has been revoked", { variant: "success" });
                          })
                          .catch((err) => {
                            enqueueSnackbar(err.message, { variant: "error" });
                          })
                          .then(() => setSendingStatus(false));
                      }
                    }
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          )
        }

        {
          (emails.length > 0) && (
            <div className="send-invitation">
              <UiSelect
                className="access-level-select"
                label={props.label}
                onChange={
                  (event) => {
                    setAccessState(event.target.value);
                  }
                }
                size="small"
                value={accessState ?? props.value}
                variant="outlined"
                options={props.roles}
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
                    props.onSendInvitation(emails)
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
  roles: PropTypes.array.isRequired,
  shares: PropTypes.array.isRequired,
};

export default ProjectAccessSharingSection;
