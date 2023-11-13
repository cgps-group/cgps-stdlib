import React from "react";
import PropTypes from "prop-types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DndProvider,
  useDrag,
  useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/DeleteTwoTone";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";

import defaultStyles from "./index.module.css";

function DraggableRow(props) {
  const [, dropRef] = useDrop({
    accept: "row",
    drop: (draggedRow) => props.onRowDragMove(draggedRow.index, props.row.index),
  });

  const [_, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => props.row,
    type: "row",
  });

  return (
    <TableRow ref={previewRef}>
      <TableCell ref={dropRef}>
        <IconButton size="small" ref={dragRef}>
          <DragIndicatorIcon fontSize="inherit" />
        </IconButton>
      </TableCell>
      {props.row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
      <TableCell>
        <IconButton size="small" onClick={() => props.onRowDelete(props.row.index)}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

DraggableRow.propTypes = {
  onRowDelete: PropTypes.func.isRequired,
  onRowDragMove: PropTypes.func.isRequired,
  row: PropTypes.shape({
    getVisibleCells: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  }),
};
function EditableCell(props) {
  const initialValue = props.getValue() || "";
  const [value, setValue] = React.useState(initialValue);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    setValue(initialValue);
    if (!initialValue) {
      inputRef.current.focus();
    }
  }, [initialValue]);

  const updateData = () => {
    props.table.options.meta?.updateData(props.row.index, value, props.column.id);
  };

  const onBlur = () => {
    updateData();
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      updateData();
    }
  };

  return (
    <TextField
      fullWidth={true}
      inputRef={inputRef}
      label={props.column.columnDef.meta?.label}
      margin="none"
      onBlur={onBlur}
      onChange={(evt) => setValue(evt.target.value)}
      onKeyDown={onKeyDown}
      size="small"
      stepName={props.column.columnDef.meta?.stepName}
      uiSpec={props.column.columnDef.meta?.uiSpec}
      value={value}
    />
  );
}

EditableCell.propTypes = {
  getValue: PropTypes.func.isRequired,
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
  }),
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    columnDef: PropTypes.shape({
      meta: PropTypes.shape({
        label: PropTypes.string,
        stepName: PropTypes.string,
        uiSpec: PropTypes.string,
      }),
    }),
  }),
  table: PropTypes.shape({
    options: PropTypes.shape({
      meta: PropTypes.shape({
        updateData: PropTypes.func.isRequired,
      }),
    }),
  }),
};

function DataTable(props) {
  const table = useReactTable({
    columns: props.columns,
    data: props.rows,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: props.defaultColumn,
    meta: {
      updateData: props.onCellChange,
    },
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Table className={defaultStyles.root} size="small">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableCell style={{ width: 55 }}></TableCell>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableCell>
              ))}
              <TableCell style={{ width: 55 }}></TableCell>
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <DraggableRow
              key={row.id}
              row={row}
              onRowDragMove={props.onRowDragMove}
              onRowDelete={props.onRowDelete}
            />
          ))}
        </TableBody>
      </Table>
      <Box textAlign="center" paddingTop={1}>
        <Button onClick={props.onRowAdd}>
          <AddIcon /> Add
        </Button>
      </Box>
    </DndProvider >
  );
}
DataTable.propTypes = {
  onRowAdd: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  onCellChange: PropTypes.func.isRequired,
  onRowDragMove: PropTypes.func.isRequired,
  onRowDelete: PropTypes.func.isRequired,
  defaultColumn: PropTypes.shape({
    cell: PropTypes.func,
  }),
  rows: PropTypes.array.isRequired,
};

DataTable.EditableCell = EditableCell;

export default DataTable;
