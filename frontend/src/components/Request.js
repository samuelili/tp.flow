import React, {useContext} from 'react';
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {deepOrange} from "@material-ui/core/colors";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import db from '../util/database';

import '../styles/request.css';
import AppContext from "../AppContext";
import moment from "moment";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import sendMessage from "../util/sms";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    background: deepOrange['500'],
    color: '#fff',
    padding: 16,
    flexDirection: 'column'
  },
  button: {
    marginTop: 8,
    borderColor: '#fff',
    color: '#fff'
  }
});

export default function Request({request, name, deliveryMethod, notes, date, quantity, hideAccept, accepted, id, onDeliverClick, submittedBy, acceptedBy}) {
  const classes = useStyles();
  const context = useContext(AppContext);

  function acceptRequest() {
    db.collection('requests').doc(id).update({
      acceptedBy: context.uid
    }).then(() => {
      db.collection('users').doc(submittedBy).get()
        .then(doc => {
          let user = doc.data();
          console.log(doc.data());
          sendMessage(`+1${user.number}`, `${context.user.displayName} has accepted your request for ${quantity}x ${name}!`)
        });
      context.refresh();
    })
  }

  function getExtraInfo() {
    if (deliveryMethod === "" && notes !== "")
      return (<Grid container spacing={1}>
          <Grid item xs={1}>
            <Icon>assignment</Icon>
          </Grid>
          <Grid item xs={5}>
            <Typography variant={"body1"}>{notes}
            </Typography>
          </Grid>
        </Grid>
      );
    else if (deliveryMethod !== "" && notes === "")
      return (<Grid container spacing={1}>
        <Grid item xs={1}>
          <LocalShippingIcon/>
        </Grid>
        <Grid item xs={5}>
          <Typography variant={"body1"}>{deliveryMethod}
          </Typography>
        </Grid>
      </Grid>);
    else if (deliveryMethod !== "" && notes !== "")
      return (<Grid container spacing={1}>
        <Grid item xs={1}>
          <LocalShippingIcon/>
        </Grid>
        <Grid item xs={5}>
          <Typography variant={"body1"}>{deliveryMethod}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Icon>assignment</Icon>
        </Grid>
        <Grid item xs={5}>
          <Typography variant={"body1"}>{notes}
          </Typography>
        </Grid>
      </Grid>);
    else return "";
  }

  return (
    <Grid item xs={12}>
      <Paper className={classes.root + " request"} elevation={2}>
        <Typography variant={"h5"} style={{display: 'block'}}>
          <div style={{float: 'left'}}>{name}</div>
          <div style={{float: 'right'}}>{quantity}x</div>
        </Typography>
        <Typography variant={"caption"} gutterBottom>
          {moment(date).format("MMM Do, YYYY")}
        </Typography>
        {getExtraInfo()}
        {(acceptedBy && !accepted) &&
        <Typography variant={"button"} style={{width: '100%', textAlign: 'center'}}>
          Accepted!
        </Typography>
        }
        {!hideAccept &&
        <Button
          variant="outlined"
          className={classes.button}
          endIcon={<Icon>check</Icon>}
          size={"small"}
          onClick={acceptRequest.bind(this)}>
          Accept
        </Button>
        }
        {accepted &&
        <Button
          variant="outlined"
          className={classes.button}
          endIcon={<Icon>send</Icon>}
          size={"small"}
          onClick={() => onDeliverClick(request, id)}>
          > Deliver
        </Button>
        }
      </Paper>
    </Grid>
  )
}
