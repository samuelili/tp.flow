import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close"
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Map from './Map';

import '../styles/hospital-data.css'
import AppBar from "@material-ui/core/AppBar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Fab from "@material-ui/core/Fab";
import DirectionsIcon from '@material-ui/icons/Directions';
import MapIcon from "@material-ui/icons/Map";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import AddRequestDialog from "./AddRequestDialog";
import db from "../util/database";
import Request from "./Request";
import withStyles from "@material-ui/core/styles/withStyles";
import Nothing from "./Nothing";
import ConfirmDialog from "./ConfirmDialog";
import HelpIcon from '@material-ui/icons/Help';
import AppContext from "../AppContext";
import includes from "../util/includes";

const google = window.google;

const styles = {
  root: {
    flexGrow: 1,
    boxShadow: "0px 4px 5px 0px rgba(0,0,0,0.14)"
  },
  title: {
    flexGrow: 1,
  }
};

class HospitalData extends Component {
  state = {
    open: false,
    confirmOpen: false,
    place: {
      photos: [{
        getUrl: () => "",
      }]
    },
    hospital: {},
    requests: []
  };
  collection = db.collection("hospitals");

  update() {
    Map.service.getDetails({
      placeId: this.props.placeId,
      fields: ['formatted_address', 'name', 'photos', 'url']
    }, (result, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK)
        this.setState({place: result});
    });
    this.collection.doc(this.props.placeId ? this.props.placeId : "placeholder").get()
      .then((document) => {
        this.setState({hospital: document.data()})
      });
    db.collection('requests').where("owner", "==", this.props.placeId || "")
      .get()
      .then(querySnapshot => {
        let requests = [];
        querySnapshot.forEach(doc => {
          if (!doc.data().acceptedBy)
            requests.push({...doc.data(), id: doc.id});
        });
        this.setState({requests});
      });
  }

  componentDidMount() {
    this.context.subscribeMethod(this.update.bind(this));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.placeId !== prevProps.placeId) {
      this.update();
    }
  }

  handleSubmit(data) {
    db.collection('requests').doc().set({
      ...data,
      owner: this.props.placeId
    }).then(() => {
      this.setState({open: false});
      this.context.refresh();
    });
  };

  static contextType = AppContext;

  handleOk() {
    let hospitals = this.context.user.hospitals || [];
    db.collection("users").doc(this.context.uid).update({
      hospitals: [...hospitals, {
        placeId: this.props.placeId,
        name: this.state.place.name
      }]
    }).then(() => {
      this.context.updateUser();
      this.setState({confirmOpen: false})
    });
  }

  render() {
    const {classes, onClose, placeId, visible} = this.props;
    const {open, requests, place, confirmOpen} = this.state;

    let hospitals = this.context.user.hospitals || [];

    return (
      <div className={`hospital-data ${visible ? "visible" : ""}`}>
        <Nothing happy>Click on a hospital to see more</Nothing>
        <ConfirmDialog onOk={this.handleOk.bind(this)} open={confirmOpen}
                       onClose={() => this.setState({confirmOpen: false})}>
          Do you work at this hospital?
        </ConfirmDialog>
        <AddRequestDialog open={open} onClose={() => this.setState({open: false})}
                          onSubmit={this.handleSubmit.bind(this)}/>
        <AppBar position={"sticky"} className={classes.root}>
          <Toolbar>
            <Typography varient={"h3"} component={"h3"} className={classes.title}>
              {place.name}
            </Typography>
            <IconButton
              aria-label="Close"
              aria-controls="menu-appbar"
              onClick={onClose}
              color="inherit"
            >
              <CloseIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={"hospital-data-img"} style={{backgroundImage: `url(${place.photos[0].getUrl()})`}}>
          <IconButton onClick={() => this.setState({confirmOpen: true})}>
            <HelpIcon/>
          </IconButton>
        </div>
        <div className={"hospital-data-content"}>
          <Fab className={"directions"} color="secondary" component={"a"} href={place.url} target={"_blank"}>
            <DirectionsIcon/>
          </Fab>
          <List>
            <ListItem>
              <ListItemIcon>
                <MapIcon/>
              </ListItemIcon>
              <ListItemText primary={place.formatted_address} style={{paddingRight: 64}}/>
            </ListItem>
          </List>
          <Grid container spacing={3} style={{padding: "0 32px"}}>
            <Grid item xs={12}>
              <Typography variant={"h4"}>
                Requests
                {includes(hospitals, "placeId", placeId) && <Button
                  variant="outlined"
                  color="secondary"
                  endIcon={<Icon>add</Icon>}
                  style={{float: 'right'}}
                  onClick={() => this.setState({open: true})}
                >
                  Add
                </Button>}
              </Typography>
            </Grid>
            {requests.length > 0 ? requests.map((request, i) =>
              <Request {...request} key={i}/>
            ) : <Nothing happy>Hospital is stocked up!</Nothing>}
          </Grid>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(HospitalData);
