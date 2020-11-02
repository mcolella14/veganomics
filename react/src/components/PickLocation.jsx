import React, {useContext} from 'react';
import LocationSearch from './LocationSearch';
import {LocationContext} from '../App'
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    search: {
      width: "50%",
      paddingTop: "15px",
    },
    container: {
        padding: "15px"
    }
  }))

export default function PickLocation() {
    const classes = useStyles()

    let history = useHistory();
    let location = useLocation();
    const {updateLocation} = useContext(LocationContext)

    let { from } = location.state || { from: { pathname: "/" } };
    console.log(from)

    const handlePlaceChange = (place) => {
        const newLocation = {
            coordinates:{
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
            },
            formattedAddress: place.formatted_address
        };
        updateLocation(newLocation);
        history.replace(from);
    }

    return (
        <div className={classes.container}>
            <Typography variant="h2">Pick a location to get started!</Typography>
            <LocationSearch onLocationChange={handlePlaceChange} className={classes.search}/>
        </div>
    )
}