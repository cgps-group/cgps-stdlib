/* eslint-disable class-methods-use-this */

import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@mui/material/Typography";

import useDebouncedCallback from "cgps-stdlib/hooks/use-debounced-callback.js";
import UiSelect from "cgps-stdlib/ui/select/index.js";

const ProjectAccessLevelSection = (props) => {
  const [accessState, setAccessState] = React.useState(null);

  const handleSave = useDebouncedCallback(
    props.onChange
  );

  return (
    <section className="access-level">
      <UiSelect
        className="access-level-select"
        label={props.label}
        onChange={
          (event) => {
            setAccessState(event.target.value);
            handleSave(event.target.value);
          }
        }
        size="small"
        value={accessState ?? props.value}
        variant="outlined"
      >
        {
          props.options.map(
            (item) => {
              return (
                <UiSelect.Item
                  key={item.value}
                  value={item.value}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                  >
                    {item.icon}
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
                </UiSelect.Item>
              );
            }
          )
        }
      </UiSelect>
    </section>
  );
};

ProjectAccessLevelSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
};

ProjectAccessLevelSection.defaultProps = {
  label: "Access Control",
};

export default ProjectAccessLevelSection;
