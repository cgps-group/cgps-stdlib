import React from "react";
import PropTypes from "prop-types";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import MuiCard from "@mui/material/Card";

import { EmptyObject } from "../../constants.js";

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

function DataGrid(props) {
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
  list: PropTypes.array.isRequired,
};

DataGrid.defaultProps = {
  cardProps: EmptyObject,
};

DataGrid.Card = Card;
DataGrid.SkeletonGrid = SkeletonGrid;

export default DataGrid;
