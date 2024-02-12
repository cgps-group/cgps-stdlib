import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import naturalCompare from "natural-compare";

import { EmptyObject } from "../../constants.js";

import styles from "./index.module.css";

function GridSection(props) {
  return (
    <Grid
      container
      spacing={2}
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

GridSection.propTypes = {
  Card: PropTypes.func.isRequired,
  cardProps: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
};

function DataGrid(props) {
  const orderedItems = React.useMemo(
    () => {
      if (props.sortBy) {
        return props.items.sort(props.sortBy);
      }
      else {
        return props.items;
      }
    },
    [props.sortBy, props.items],
  );

  const groupedItems = React.useMemo(
    () => {
      if (props.groupBy) {
        const groups = {};
        for (const item of orderedItems) {
          const groupValue = props.groupBy.group(item);
          if (groupValue in groups) {
            groups[groupValue].push(item);
          }
          else {
            groups[groupValue] = [ item ];
          }
        }
        if (props.groupBy.order) {
          return Object.entries(groups).sort(props.groupBy.order);
        }
        else {
          return Object.entries(groups).sort((a, b) => naturalCompare(a[0], b[0]));
        }
      }
      else {
        return undefined;
      }
    },
    [props.groupBy, orderedItems],
  );

  if (groupedItems) {
    return (
      (groupedItems).map(
        ([ group, items ]) => {
          return (
            <React.Fragment key={group}>
              <Typography
                className={styles.header}
              >
                {group}
              </Typography>
              <GridSection
                Card={props.Card}
                cardProps={props.cardProps}
                items={items}
              />
            </React.Fragment>
          );
        }
      )
    );
  }

  return (
    <GridSection
      Card={props.Card}
      cardProps={props.cardProps}
      items={props.items}
    />
  );
}

DataGrid.propTypes = {
  Card: PropTypes.elementType,
  sortBy: PropTypes.func.isRequired,
  groupBy: PropTypes.shape({
    group: PropTypes.func.isRequired,
    order: PropTypes.func,
  }),
  cardProps: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
};

DataGrid.defaultProps = {
  cardProps: EmptyObject,
};

export default DataGrid;
