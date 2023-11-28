import React from "react";
import PropTypes from "prop-types";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

function SkeletonGrid(props) {
  return (
    <Grid container spacing={3}>
      {
        Array.from(new Array(props.itemCount)).map(
          (_, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={3}
            >
              <Skeleton variant="rectangular" height={132} />
            </Grid>
          )
        )
      }
    </Grid>
  );
}

SkeletonGrid.propTypes = {
  itemCount: PropTypes.number,
};

SkeletonGrid.defaultProps = {
  itemCount: 12,
};

export default SkeletonGrid;
