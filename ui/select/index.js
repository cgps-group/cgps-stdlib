import PropTypes from "prop-types";
import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";

function formatOptions(props) {
  if (props.children) {
    return props.children;
  }
  else if (props.options) {
    return props.options.map(
      (item) => (
        <MenuItem
          key={item.value}
          value={item.value}
        >
          <Box
            display="flex"
            alignItems="center"
          >
            <PeopleOutlineOutlinedIcon />
            <Box
              display="flex"
              flexDirection="column"
              style={{ marginLeft: 16 }}
            >
              {item.label}
              {
                item.description && (
                  <Typography
                    color="textSecondary"
                    component="small"
                    variant="caption"
                  >
                    {item.description}
                  </Typography>
                )
              }
            </Box>
          </Box>
        </MenuItem>
      )
    );
  }
  return undefined;
}

function UiSelect(props) {
  const { size, variant, ...rest } = props;
  return (
    <FormControl
      size={size}
      variant={variant}
    >
      <InputLabel>
        {props.label}
      </InputLabel>
      <Select
        {...rest}
      >
        {formatOptions(props)}
      </Select>
    </FormControl>
  );
}

UiSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  size: PropTypes.string,
  value: PropTypes.any.isRequired,
  variant: PropTypes.string,
};

UiSelect.Item = MenuItem;

export default UiSelect;
