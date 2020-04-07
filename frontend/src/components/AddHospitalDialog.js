import {Dialog} from "@material-ui/core";
import React, {Component} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import PlaceSearch from "./PlaceSearch";
import db from '../util/database';
import Map from './Map';
import AppContext from "../AppContext";
import Typography from "@material-ui/core/Typography";

const google = window.google;

class AddHospitalDialog extends Component {
  state = {
    place: null
  };

  static contextType = AppContext;

  handleChange(place) {
    this.setState({place});
  }

  handleSubmit() {
    let place = this.state.place;
    console.log(this.state.place);
    Map.service.getDetails({
      placeId: place.place_id,
      fields: ['name', 'geometry']
    }, (result, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        let docRef = db.collection("hospitals").doc(place.place_id);
        docRef.get().then(doc => {
          if (!doc.exists)
            docRef.set({
              name: result.name,
              placeId: place.place_id,
              position: {
                lng: result.geometry.location.lng(),
                lat: result.geometry.location.lat()
              },
              requests: []
            }).then(() => {
              this.props.handleClose();
              this.context.refreshMap()
            });
          else
            this.props.handleClose();
        })
      }
    });
  }

  render() {
    let {handleClose, open} = this.props;

    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}
              fullWidth>
        <DialogTitle id="simple-dialog-title">Add Hospital</DialogTitle>
        <DialogContent>
          <Typography variant={"body1"}>
            Add a hospital's address if they're not on the map.
          </Typography>
          <PlaceSearch onChange={this.handleChange.bind(this)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSubmit.bind(this)} color="primary" varient={"outline"}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default AddHospitalDialog;
