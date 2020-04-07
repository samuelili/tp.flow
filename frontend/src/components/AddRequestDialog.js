import {Dialog} from "@material-ui/core";
import React, {Component} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import AppContext from "../AppContext";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";

class AddRequestDialog extends Component {
  state = {
    name: '',
    deliveryMethod: 'Leave at Front Door',
    notes: '',
    quantity: 1,
  };

  static contextType = AppContext;

  handleChange(place) {
    this.setState({place});
  }

  handleSubmit() {
    this.props.onSubmit({...this.state, date: Date.now(), submittedBy: this.context.uid});
    this.props.onClose();
  }

  render() {
    let {onClose, open} = this.props;

    const quantaties = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
      <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}
              fullWidth>
        <DialogTitle id="simple-dialog-title">Add Request</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <TextField
                required
                value={this.state.name}
                onChange={(e) => this.setState({name: e.target.value})}
                label={"Item Name"}
                variant={"outlined"}
                placeholder={"Try typing \"Toilet Paper\""}
                fullWidth/>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                select
                defaultValue={1}
                value={this.state.quantity}
                onChange={(e) => this.setState({quantity: e.target.value})}
                label={"Quantity"}
                variant={"outlined"}
                type={'number'}
                fullWidth>
                {quantaties.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                value={this.state.deliveryMethod}
                onChange={(e) => {
                  this.setState({deliveryMethod: e.target.value});
                }}
                label={"Delivery Method"}
                variant={"outlined"}
                select
                style={{width: '100%'}}
              >
                <MenuItem key={0} value={"Leave at Front Door"}>
                  Leave at Front Door
                </MenuItem>
                <MenuItem key={1} value={"Leave at Side Door"}>
                  Leave at Side Door
                </MenuItem>
                <MenuItem key={2} value={"Knock and Leave at Front Door"}>
                  Knock and Leave at Front Door
                </MenuItem>
                <MenuItem key={3} value={"Leave at Front Counter"}>
                  Leave at Front Counter
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={7}>
              <TextField
                value={this.state.notes}
                onChange={(e) => this.setState({notes: e.target.value})}
                label={"Notes"}
                variant={"outlined"}
                multiline
                fullWidth
              placeholder={"ie. Extra soft please!"}/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
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

export default AddRequestDialog;
