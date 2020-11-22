
import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import NavMenu from './NavMenu'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {LocationContext} from '../App'
import LocationSearch from './LocationSearch'
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
    menuButton: {
        // marginRight: theme.spacing(2),
        // flex: '1 0 0',
        // justifyContent: 'flex-start',
        // display: 'flex',
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
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        color: 'white',
    },
    innerAppBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    locationBox: {
        backgroundColor: 'white',
        borderRadius: '5px'
    }
    
}));

export default function NavBar(props) {
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
                <LocationSearch onLocationChange={handlePlaceChange} className={classes.locationBox}/>
            )
        }
        else {
            locationEl = (
                <Button variant="outlined" className={classes.locationBox}>
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
        <React.Fragment>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                <div className={classes.innerAppBar}>
                    <Link href="/" color="inherit" underline="none">
                        <Typography variant="h6" noWrap>
                            Veganomics
                        </Typography>
                    </Link>
                    {locationEl}
                    <NavMenu className={classes.menuButton}/>
                </div>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </React.Fragment>
    )
}