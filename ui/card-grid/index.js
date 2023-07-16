import React from "react";
import PropTypes from "prop-types";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import MuiCard from "@mui/material/Card";

import styles from "./index.module.css";

function Card(props) {
  return (
    <MuiCard
      className={styles.card}
      variant="outlined"
    >
      {props.children}
    </MuiCard>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

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
/**
 * This component is based on https://github.com/microreact/server/blob/main/components/AccountProjectGrid.js
 *
 * It doesn't yet match all functionality provided by that component as it can't be tested and it's unclear what should be included.
 *
 */
function CardGrid(props) {
  return (
    <Grid container spacing={3}>
      {
        props.list.map(
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
              <props.Card item={item} />
            </Grid>
          )
        )
      }
    </Grid>
  );
}

CardGrid.propTypes = {
  Card: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
};

CardGrid.Card = Card;
CardGrid.SkeletonGrid = SkeletonGrid;

export default CardGrid;
