import React, {Component} from 'react';
import AppContext from "../AppContext";

import '../styles/profile.css';
import Typography from "@material-ui/core/Typography";
import {ListItemText} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Request from "../components/Request";
import Nothing from "../components/Nothing";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import AddRequestDialog from "../components/AddRequestDialog";
import db from '../util/database';
import DeliverDialog from "../components/DeliverDialog";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import sendMessage from "../util/sms";

class Profile extends Component {
  state = {
    open: false,
    requests: [],
    accepted: [],
    deliverOpen: false,
    deliverRequest: {},
    number: this.context.user.number,
    address: this.context.user.address,
  };
  static contextType = AppContext;

  refresh() {
    db.collection('requests').where("submittedBy", "==", this.context.uid)
      .get()
      .then(querySnapshot => {
        let requests = [];
        querySnapshot.forEach(doc => {
          if (!doc.data().delivered)
            requests.push({...doc.data(), id: doc.id});
        });
        this.setState({requests});
      });

    db.collection('requests').where("acceptedBy", "==", this.context.uid)
      .get()
      .then(querySnapshot => {
        let accepted = [];
        querySnapshot.forEach(doc => {
          if (!doc.data().delivered)
            accepted.push({...doc.data(), id: doc.id});
        });
        this.setState({accepted});
      });
  }

  componentDidMount() {
    this.refresh();
    this.context.subscribeMethod(this.refresh.bind(this));
  }

  handleSubmit(data) {
    db.collection('requests').doc().set({
      ...data,
      owner: this.context.uid
    }).then(() => {
      this.setState({open: false});
      this.context.refresh();
    });
  }

  handleDelivered(request) {
    db.collection('requests').doc(request.id).update({
      delivered: {
        date: Date.now(),
        deliveredBy: this.context.uid
      }
    }).then(() => {
      db.collection('users').doc(request.submittedBy).get()
        .then(doc => {
          let user = doc.data();
          console.log(doc.data());
          sendMessage(`+1${user.number}`, `${this.context.user.displayName} has delivered your request for ${request.quantity}x ${request.name}!`)
        });
      this.context.refresh();
    });
    this.setState({
      deliverOpen: false
    })
  }

  updateNumber() {
    db.collection('users').doc(this.context.user.uid).update({number: this.state.number});
  }

  updateAddress() {
    db.collection('users').doc(this.context.user.uid).update({address: this.state.address});
  }

  render() {
    const {open, deliverOpen, deliverRequest} = this.state;
    return (
      <div>
        <DeliverDialog open={deliverOpen} request={deliverRequest} onClose={() => this.setState({deliverOpen: false})}
                       onDelivered={this.handleDelivered.bind(this)}/>
        <AddRequestDialog open={open} onClose={() => this.setState({open: false})}
                          onSubmit={this.handleSubmit.bind(this)}/>
        <div className={"profile-header"}>
          <Typography variant={'h3'}>
            {this.context.user.displayName}
          </Typography>
          <img src={this.context.user.photoURL} alt={""}/>
        </div>
        <div className={"profile-content"} style={{padding: '24px 16px 16px 16px'}}>
          <FormControl style={{width: '100%'}} variant={"outlined"}>
            <InputLabel htmlFor="profile-number">Phone Number</InputLabel>
            <OutlinedInput
              id="profile-number"
              type={'tel'}
              defaultValue={this.context.user.number}
              onChange={e => this.setState({number: e.target.value})}
              style={{marginRight: 136}}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={this.updateNumber.bind(this)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl style={{marginTop: 16, width: '100%'}} variant={"outlined"}>
            <InputLabel htmlFor="profile-address">Address</InputLabel>
            <OutlinedInput
              id="profile-address"
              type={'text'}
              defaultValue={this.context.user.address}
              onChange={e => this.setState({address: e.target.value})}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={this.updateAddress.bind(this)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Grid container spacing={3} style={{marginTop: 16}}>
            <Grid item xs={12}>
              <Typography variant={"h4"}>
                Pending Requests
                <Button
                  variant="outlined"
                  color="secondary"
                  endIcon={<Icon>add</Icon>}
                  onClick={() => this.setState({open: true})}
                  className={"add-request"}
                >
                  Add
                </Button>
              </Typography>
            </Grid>
            {this.state.requests.length > 0 ? this.state.requests.map((request, i) =>
              <Request {...request} hideAccept key={i}/>
            ) : <Nothing happy>All stocked up!</Nothing>}
            <Grid item xs={12}>
              <Typography variant={"h4"}>
                Accepted Requests
              </Typography>
            </Grid>
            {this.state.accepted.length > 0 ? this.state.accepted.map((request, i) =>
              <Request {...request} request={request} accepted hideAccept key={i}
                       onDeliverClick={() => this.setState({deliverOpen: true, deliverRequest: request})}/>
            ) : <Nothing happy>All delivered!</Nothing>}
            {this.context.user.hospitals.length > 0 && (
              <Grid item xs={12}>
                <Typography variant={"h4"}>
                  My Hospitals
                </Typography>
              </Grid>
            )}
            {this.context.user.hospitals.length > 0 && (
              <List>
                {this.context.user.hospitals.map(hospital => (
                  <ListItem key={hospital.placeId}>
                    <ListItemText primary={hospital.name}/>
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>
        </div>
      </div>
    )
  }
}

export default Profile;
