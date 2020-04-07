import React, {useContext, useState} from 'react';
import Fab from "@material-ui/core/Fab";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import LiveHelpIcon from '@material-ui/icons/LiveHelp';

import '../styles/action-fabs.css';
import AddHospitalDialog from "./AddHospitalDialog";
import AddRequestDialog from "./AddRequestDialog";
import db from "../util/database";
import AppContext from "../AppContext";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";


export default function ActionFabs() {
  const context = useContext(AppContext);
  const [open2, setOpen2] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  function handleSubmit(data) {
    db.collection('requests').doc().set({
      ...data,
      owner: context.uid
    }).then(() => {
      setOpen2(false);
      context.refresh();
    });
  }

  return (
    <ClickAwayListener onClickAway={() => setVisible(false)}>
      <div className={`action-fabs ${visible ? 'visible' : ''}`}>
        <AddRequestDialog open={open2} onClose={() => setOpen2(false)}
                          onSubmit={handleSubmit}/>
        <AddHospitalDialog open={open} handleClose={() => setOpen(false)}/>
        <Fab color="primary" aria-label="add" className={"add-button"} onClick={() => setVisible(true)}>
          <AddIcon/>
        </Fab>
        <div className={"shade"}/>
        <div className={"smaller-fabs"}>
          <div>
            <Typography variant={"button"}>
              Add Request
            </Typography>
            <Fab color="secondary" aria-label="edit" className={"add-button"} size={"small"} onClick={() => {
              setOpen2(true)
            }}>
              <LiveHelpIcon/>
            </Fab>
          </div>
          <div>
            <Typography variant={"button"}>
              Add Hospital
            </Typography>
            <Fab color="secondary" aria-label="edit" className={"add-button"} size={"small"} onClick={() => {
              setOpen(true)
            }}>
              <LocalHospitalIcon/>
            </Fab>
          </div>
        </div>
      </div>
    </ClickAwayListener>
  )
}
