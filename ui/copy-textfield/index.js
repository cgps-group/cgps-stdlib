import PropTypes from "prop-types";
import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import InputLabel from "@mui/material/InputLabel";

import { CopyToClipboard } from "react-copy-to-clipboard";

class UiCopyTextfield extends React.PureComponent {

  state = {
    copied: false,
  }

  render() {
    const { props, state } = this;

    return (
      <FormControl
        variant="outlined"
        color="primary"
        title={props.title || "Copy URL"}
        size={props.size}
      >
        { props.label && (<InputLabel>{ props.label }</InputLabel>) }

        <CopyToClipboard
          text={props.value}
          onCopy={() => this.setState({ copied: true })}
        >
          <OutlinedInput
            value={props.value}
            label={props.label}
            readOnly
            color="primary"
            endAdornment={
              <InputAdornment position="end">
                { props.children }
                <IconButton
                  aria-label="Copy"
                  edge="end"
                >
                  { state.copied ? <DoneOutlineRoundedIcon /> : <FileCopyRoundedIcon /> }
                </IconButton>
              </InputAdornment>
            }
          />
        </CopyToClipboard>
      </FormControl>
    );
  }

}

UiCopyTextfield.displayName = "UiCopyTextfield";

UiCopyTextfield.propTypes = {
  label: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default UiCopyTextfield;
