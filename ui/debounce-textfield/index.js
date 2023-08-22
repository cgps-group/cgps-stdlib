import PropTypes from "prop-types";
import React from "react";
import TextField from "@mui/material/TextField";
import { DebounceInput } from "react-debounce-input";

const Input = React.forwardRef(
  (props, ref) => (
    <DebounceInput
      inputRef={ref}
      {...props}
    />
  )
);

Input.displayName = "Input";

const inputComponent = { inputComponent: Input };

function DebounceTextfield(props) {
  const { debounceInputProp, ...rest } = props;
  return (
    <TextField
      InputProps={inputComponent}
      inputProps={debounceInputProp}
      {...rest}
    />
    // <FormControl
    //   variant={props.variant}
    //   color={props.color}
    //   title={props.title}
    //   size={props.size}
    //   label={props.label}
    // >
    //   {props.label && (<InputLabel>{props.label}</InputLabel>)}

    //   <OutlinedInput
    //     inputComponent={Input}
    //     label={props.label}
    //     className={props.className}
    //     debounceTimeout={props.debounceTimeout ?? 3000}
    //     onChange={props.onChange}
    //     value={props.value}
    //   />
    // </FormControl>
  );
}

DebounceTextfield.displayName = "DebounceTextfield";

DebounceTextfield.propTypes = {
  debounceInputProp: PropTypes.object,
};

export default DebounceTextfield;
