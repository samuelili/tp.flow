import React, {useEffect, useState} from 'react';
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Icon from "@material-ui/core/Icon";
import db from '../util/database';
import Grid from "@material-ui/core/Grid";
import Request from "./Request";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";

const DeliverDialog = ({request, onDelivered, onClose, open}) => {
  const [person, setPerson] = useState({submittedBy: ""});

  useEffect(() => {
    if (Object.keys(request).length > 0)
      db.collection('users').doc(request.submittedBy).get()
        .then((doc) => {
          setPerson(doc.data());
        })
  }, [request]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"md"}>
      <DialogTitle>
        Delivering: {request.name}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Grid item xs={12}>
              <Request {...request} hideAccept/>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={2} style={{padding: 16}}>
                <Typography variant={"body1"}>{person.address}</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper elevation={2} style={{padding: 8}}>
              <Typography variant={'h5'} style={{padding: 8}}>
                Contact Info
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Icon>phone</Icon>
                  </ListItemIcon>
                  <ListItemText primary={person.number} style={{paddingRight: 64}}/>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Icon>language</Icon>
                  </ListItemIcon>
                  <ListItemText primary={person.email} style={{paddingRight: 64}}/>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{position: 'relative'}}>
        <IconButton component="a"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURI(person.address)}`}
                    target="_blank" color={"secondary"} className="map-button"
                    style={{position: 'absolute', left: 16}}><Icon>directions</Icon>
        </IconButton>
        <Button component="a" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURI(person.address)}`}
                target="_blank" color={"secondary"} className="map-button" endIcon={<Icon>directions</Icon>}
                style={{position: 'absolute', left: 16}}><span>Maps</span></Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={() => onDelivered(request)} color="primary" variant={"outlined"}
                endIcon={<Icon>check</Icon>}>
          Mark as Delivered
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(DeliverDialog);
