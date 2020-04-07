import React, {Component} from "react";
import '../styles/map.css';
import hospitalIcon from '../images/local_hospital.svg';
import userIcon from '../images/accessibility.svg';
import homeIcon from '../images/home.svg';
import {palette} from "../pages/Root";
import db from '../util/database';
import AppContext from "../AppContext";

const google = window.google;

class Map extends Component {
  ref;
  static map;
  static service;
  geocoder;
  currentPosMarker;
  markers = [];

  static contextType = AppContext;

  state = {
    center: {
      lat: 75.8877, lng: 22.7187
    }
  };

  poll({coords}) {
    console.log("Polling:", coords);
    if (this.currentPosMarker == null) {
      Map.map.panTo({
        lat: coords.latitude, lng: coords.longitude
      });
      this.currentPosMarker = new google.maps.Marker({
        position: {
          lat: coords.latitude, lng: coords.longitude
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          strokeColor: palette.secondary["500"]
        },
        map: Map.map
      });
    }
  }

  addMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    db.collection("hospitals").get()
      .then(hospitals => {
        hospitals.forEach(doc => {
          this.addHospital(doc.data())
        })
      });
    db.collection("users").get()
      .then(users => {
        users.forEach(user => {
          this.addHome(user.data().address, user.data().uid === this.context.uid ? homeIcon : userIcon)
        })
      })
  }

  componentDidMount() {
    console.log('Map is mounting');
    Map.map = new google.maps.Map(this.ref, {
      zoom: 12,
      fullscreenControl: false,
      streetViewControl: false,
      setClickableIcons: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      mapTypeControl: false,
    });
    Map.map.addListener('tilesloaded', () => {
      this.props.loaded();
    });

    Map.service = new google.maps.places.PlacesService(Map.map);
    this.geocoder = new google.maps.Geocoder();

    // new google.maps.Marker({
    //   position: {lat: coords.latitude, lng: coords.longitude},
    //   map: this.map,
    //   title: 'Home',
    //   animation: google.maps.Animation.DROP,
    //   icon: homeIcon
    // });

    this.addMarkers();
    this.context.setRefreshMap(this.addMarkers.bind(this));
    this.addHome(this.context.user.address, homeIcon);

    if (navigator.geolocation) {
      setInterval(() => navigator.geolocation.getCurrentPosition(this.poll.bind(this)), 5000);
    }
  }

  addHome(address, icon) {
    this.geocoder.geocode({address}, (results) => {
      let result = results[0];
      console.log("result", result.geometry);
      const marker = new google.maps.Marker({
        position: {
          lng: result.geometry.location.lng(),
          lat: result.geometry.location.lat()
        },
        map: Map.map,
        title: address,
        animation: google.maps.Animation.DROP,
        icon: icon || userIcon
      });
      this.markers.push(marker);
    });
  }

  addHospital(data) {
    console.log(data);
    let {name, position} = data;
    const marker = new google.maps.Marker({
      position: {
        lat: position.lat,
        lng: position.lng
      },
      map: Map.map,
      title: name,
      animation: google.maps.Animation.DROP,
      icon: hospitalIcon
    });
    marker.addListener('click', () => {
      Map.map.panTo({
        lat: position.lat,
        lng: position.lng
      });
      this.props.onSelected(data)
    });
    this.markers.push(marker);
  }

  render() {
    return (
      <div className={"map"} ref={ref => this.ref = ref}/>
    )
  }
}

export default Map;
