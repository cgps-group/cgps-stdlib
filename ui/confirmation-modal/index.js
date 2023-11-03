import React, { useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function ConfirmationModal(props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleConfirm = () => {
    props.onConfirm?.();
    setIsOpen(false);
  };

  const handleCloseModal = () => {
    props.onClose?.();
    setIsOpen(false);
  };

  return (
    <>
      <Box
        display="inline-block"
        onClick={handleOpenModal}
      >
        {props.children}
      </Box>
      <Dialog
        open={isOpen}
        onClose={handleCloseModal}
      >
        <Box padding={1}>
          <DialogTitle>
            {props.title}
          </DialogTitle>
          <DialogContent>
            {props.message}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

ConfirmationModal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

ConfirmationModal.defaultProps = {
  title: "Confirm action",
  message: "Are you sure you want to do this?",
};

export default ConfirmationModal;
