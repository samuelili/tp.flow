import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import Request from "../components/Request";
import Nothing from "../components/Nothing";
import AppContext from "../AppContext";

import db from '../util/database';

class Nearby extends Component {
  state = {
    requests: []
  };
  static contextType = AppContext;

  refresh() {
    db.collection('requests').get()
      .then(docs => {
        let requests = [];
        docs.forEach(doc => {
          if (!doc.data().acceptedBy && doc.data().submittedBy !== this.context.uid) {
            requests.push({...doc.data(), id: doc.id});
          }
        });
        this.setState({requests});
      })
  }

  componentDidMount() {
    this.refresh();
    this.context.subscribeMethod(this.refresh.bind(this));
    setInterval(() => {
      console.log("Refreshing!");
      this.context.refresh();
    }, 5000);
  }

  render() {
    return (
      <Grid container spacing={3} style={{padding: 16, overflowX: 'hidden'}}>
        {this.state.requests.length > 0 ? this.state.requests.map((request, i) =>
          <Request {...request} key={i}/>
        ) : <Nothing>No nearby requests...</Nothing>}
      </Grid>
    )
  }
}

export default Nearby;
