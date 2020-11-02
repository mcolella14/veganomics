import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React from 'react';
import { useState, useEffect } from 'react';
import {TextField} from '@material-ui/core'
import Loader from './Loader';
import Autocomplete from 'react-google-autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import {googleMaps as apiKey} from '../keys.json';


import { LocationContext } from '../App'

const useStyles = makeStyles((theme) => ({
    addressInput: {
      width: '100%',
    }
  }))

// const mapStyles = {
//     width: '500px',
//     height: '300px'
// }

// const infoStyle = {
//     width: '300px',
//     height: '500px',
// }

// const initialCenter= {
//     lat: 41.481754,
//     lng:  -81.716235
// }


export function FormMap (props) {
    const classes = useStyles();
    // const [ selectedPlace, setSelectedPlace ] = useState(null)
    const [ currentMarker, setCurrentMarker ] = useState(null)
    const [ infoVisisble, setInfoVisible ] = useState(false)
    const [ center, setCenter ] = useState(null)

    useEffect((() => {
        console.log('SETTING AUTOCOMPLETE')
        const autocomplete = new props.google.maps.places.Autocomplete(document.getElementById('autocomplete'));
        autocomplete.setFields(["geometry", "formatted_address", "name"]);
        autocomplete.addListener("place_changed", () => fillInAddress(autocomplete))
    }), [])

    const fillInAddress = (autocomplete) => {
        const place = autocomplete.getPlace();
        // setSelectedPlace(place);
        props.onLocationChange(place)
        // const location = place.geometry.location;
        // let tempCenter = {}
        // tempCenter.lat = location.lat();
        // tempCenter.lng = location.lng();
        // setCenter(tempCenter);
        // setCurrentMarker(null);
        // setInfoVisible(false);
    }

    // const displayInfoWindow = (props, marker, e) => {
    //     if (!infoVisisble){
    //         if(!currentMarker){
    //             setCurrentMarker(marker);
    //         }
    //         setInfoVisible(true);
    //     }
    // }

    // const onInfoWindowClose = () => {
    //     setCurrentMarker(null);
    //     setInfoVisible(false);
    // }

    // const centerMoved = (mapProps, map) => {
        
    // } 
    
    // let markerLocation = {}
    // let markerEl = null
    // if (selectedPlace) {
    //     let location = selectedPlace.geometry.location
    //     markerLocation.lat = location.lat();
    //     markerLocation.lng = location.lng();
    //     markerEl = (
    //         <Marker
    //             title={selectedPlace.name}
    //             name={'What is this?'}
    //             onMouseover={displayInfoWindow}
    //             position={markerLocation}
    //         >
    //         </Marker>
    //     )
    // }

    return (
        <div>
            {/* <input
                id="autocomplete"
                placeholder="Enter your address"
                type="text"
            /> */}
            <TextField 
                error={props.error}
                helperText={props.helperText}
                name="location"
                inputRef={props.inputRef}
                variant="outlined" 
                className={classes.addressInput}
                id="autocomplete"
                placeholder="Thanks Google Maps API..."
            />
            {/* <Map 
                google={props.google}
                onReady={initAutocomplete}
                onDragend={centerMoved}
                initialCenter={initialCenter}
                center={center}
                zoom={14}
                style={mapStyles}
            >
                {markerEl}
                {markerEl && (
                    <InfoWindow
                        onClose={onInfoWindowClose}
                        style={infoStyle}
                        marker={currentMarker}
                        visible={infoVisisble}
                        >
                        <div>
                        <p>{selectedPlace.name}</p>
                        </div>
                    </InfoWindow>
                )}
            </Map> */}
        </div>
    );
  }

export default GoogleApiWrapper({
    apiKey: apiKey
})(FormMap)