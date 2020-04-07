import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

export default function ConfirmDialog({onOk, onClose, open, children}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogContentText>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button onClick={onOk} color="primary" varient={"outline"}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
