
import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import NavMenu from './NavMenu'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {LocationContext} from '../App'
import LocationSearch from './LocationSearch'

const useStyles = makeStyles((theme) => ({
    root: {
        // flexGrow: 1,
    },
    menuButton: {
        // marginRight: theme.spacing(2),
        flex: '1 0 0',
        justifyContent: 'flex-start',
        display: 'flex',
    },
    title: {
        // justifyContent: 'center',
        flex: '1 0 0',
        padding: '5px',
      },
    toolbar: {
        // justifyContent: 'space-around',
    },
    blankDiv: {
        flex: '1 0 0',
        alignSelf: 'flex-start',
    },
    location: {
        cursor: 'pointer',
    }
    
}));

export default function NavBar() {
    const classes = useStyles();
    const {location, updateLocation} = useContext(LocationContext)
    const [changingLocation, setChangingLocation] = useState(false)

    const handlePlaceChange = (place) => {
        const newLocation = {
            coordinates:{
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
            },
            formattedAddress: place.formatted_address
        };
        updateLocation(newLocation);
        window.location.reload();
    }

    let locationEl
    if (location) {
        if (changingLocation == true) {
            locationEl = (
                <LocationSearch onLocationChange={handlePlaceChange}/>
            )
        }
        else {
            locationEl = (
                <Button variant="outlined" color="default">
                    <Typography 
                        onClick={() => setChangingLocation(true)}
                        className={classes.location}
                        >{location.formattedAddress}
                    </Typography>
                </Button>
            )
        }
    }
    else {
        locationEl = null
    }
    console.log(location)
    console.log(changingLocation)

    return (
        <div className={classes.root}>
            <AppBar position="static" color="transparent">
                <Toolbar className={classes.toolbar}>
                    <NavMenu className={classes.menuButton}/>
                    {locationEl}
                    <a className={classes.title} href="/">
                        <Typography variant="h1">
                            <Box fontWeight="fontWeightMedium">Veganomics</Box>
                        </Typography>
                    </a>
                    <div className={classes.blankDiv}/>
                </Toolbar>
            </AppBar>
        </div>
    )
}