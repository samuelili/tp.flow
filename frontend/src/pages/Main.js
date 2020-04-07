import React, {Component} from 'react';
import '../styles/main.css';
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Map from "../components/Map";
import HospitalData from "../components/HospitalData";
import Slider from "../components/Slider";
import ActionFabs from "../components/ActionFabs";
import Paper from "@material-ui/core/Paper";
import Profile from "./Profile";
import Nearby from "./Nearby";
import Loading from "../components/Loading";
import TPFlowIcon from "../components/TPFlowIcon";

class Main extends Component {
  state = {
    page: 0,
    selected: false,
    selectedData: {},
    loaded: false
  };

  render() {
    let {selected, selectedData, loaded, page} = this.state;

    return (
      <div className={`main ${selected || page !== 0 ? "selected" : ""}`}>
        <Loading loaded={loaded}/>
        <div className={"map-container"}>
          <Map onSelected={selectedData => this.setState({selectedData, page: 0, selected: true})}
               loaded={() => this.setState({loaded: true})}/>
          <ActionFabs/>
        </div>
        <Paper elevation={6} className={"controls"}>
          <BottomNavigation
            showLabels
            value={this.state.page}
            onChange={(event, newValue) => {
              this.setState({page: newValue});
            }}
          >
            <BottomNavigationAction label="Hospital" icon={<LocalHospitalIcon/>}/>
            <BottomNavigationAction label="Requests" icon={<TPFlowIcon/>}/>
            <BottomNavigationAction label="Profile" icon={<AccountCircleIcon/>}/>
          </BottomNavigation>
          <Slider page={this.state.page} pages={3}>
            <HospitalData {...selectedData} visible={selected} onClose={() => this.setState({selected: false})}/>
            <Nearby/>
            <Profile/>
          </Slider>
        </Paper>
      </div>
    )
  }
}

export default Main;
