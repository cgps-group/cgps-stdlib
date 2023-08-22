import PropTypes from "prop-types";
import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { DebounceInput } from "react-debounce-input";
import OutlinedInput from "@mui/material/OutlinedInput";

const Input = React.forwardRef(
  (props, ref) => (
    <DebounceInput
      inputRef={ref}
      {...props}
    />
));

function DebounceTextfield(props) {
  return (
    <FormControl
      variant={props.variant}
      color={props.color}
      title={props.title}
      size={props.size}
      label={props.label}
    >
      {props.label && (<InputLabel>{props.label}</InputLabel>)}

      <OutlinedInput
        inputComponent={Input}
        label={props.label}
        className={props.className}
        debounceTimeout={props.debounceTimeout ?? 3000}
        onChange={props.onChange}
        value={props.value}
      />
    </FormControl>
  );
}

DebounceTextfield.displayName = "DebounceTextfield";

DebounceTextfield.propTypes = {
  label: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default DebounceTextfield;
