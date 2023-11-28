import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

import { EmptyObject } from "../../constants.js";

function DataGrid(props) {
  return (
    <Grid
      container
      spacing={3}
    >
      {
        props.items.map(
          (item) => (
            <Grid
              key={item.id}
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={3}
            >
              <props.Card
                item={item}
                {...props.cardProps}
              />
            </Grid>
          )
        )
      }
    </Grid>
  );
}

DataGrid.propTypes = {
  Card: PropTypes.func.isRequired,
  cardProps: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
};

DataGrid.defaultProps = {
  cardProps: EmptyObject,
};

export default DataGrid;
