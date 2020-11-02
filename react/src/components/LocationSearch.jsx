import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React from 'react';
import { useState, useEffect } from 'react';
import {TextField} from '@material-ui/core'
import Loader from './Loader';
import Autocomplete from 'react-google-autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {googleMaps as apiKey} from '../keys.json';
import { LocationContext } from '../App'

const useStyles = makeStyles((theme) => ({
    addressInput: {
      width: '100%',
    }
  }))


export function LocationSearch (props) {
    const classes = useStyles();

    useEffect((() => {
        console.log('SETTING AUTOCOMPLETE')
        const autocomplete = new props.google.maps.places.Autocomplete(document.getElementById('autocomplete'));
        autocomplete.setFields(["geometry", "formatted_address", "name"]);
        autocomplete.addListener("place_changed", () => fillInAddress(autocomplete))
    }), [])

    const fillInAddress = (autocomplete) => {
        const place = autocomplete.getPlace();
        props.onLocationChange(place)
    }

    return (
        <TextField 
            variant="outlined" 
            className={props.className || classes.addressInput}
            id="autocomplete"
            placeholder="Enter an address, city, or place"
        />
    );
  }

export default GoogleApiWrapper({
    apiKey: apiKey,
    // LoadingContainer: Loader
})(LocationSearch)