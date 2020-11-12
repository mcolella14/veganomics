import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import RestaurantsPage from './components/RestaurantsPage.jsx'
import Restaurant from './components/Restaurant.jsx';
import RestaurantForm from './components/RestaurantForm.jsx'
import PickLocation from './components/PickLocation.jsx';
import NavBar from './components/NavBar.jsx'
import { LabelImportant } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

export const LocationContext = React.createContext();

const useStyles = makeStyles((theme) => ({
}))

function LocationProvider (props) {
  const [location, setLocation] = useState(() => {
    const sessionLocation = sessionStorage.getItem('location');
    return JSON.parse(sessionLocation)
  })

  const updateLocation = (coordinates) => {
    setLocation(coordinates);
    sessionStorage.setItem('location', JSON.stringify(coordinates));
  }

  // const getPosition = async () => {
  //   setLoading(true);
  //   if (!navigator.geolocation) {
  //       setLoading(false);
  //       return
  //   }
  //   const options = {
  //     enableHighAccuracy: true,
  //     timeout: 10000,
  //     maximumAge: 120000,
  //   };
  //   navigator.geolocation.getCurrentPosition((pos) => {
  //       console.log('SETTING POSITION');
  //       const coords = {
  //         latitude: pos.coords.latitude,
  //         longitude: pos.coords.longitude
  //       }
  //       setLocation(coords)
  //       sessionStorage.setItem('location', JSON.stringify(coords));
  //       setLoading(false);
  //   }, ((err)=>{console.error(err)}), options)
  // }

  // useEffect(() => {
  //     const storedLat = sessionStorage.getItem('latitude');
  //     const storedLong = sessionStorage.getItem('longitude');
  //     console.log('STORED: ' + storedLat + storedLong)
  //     if (storedLat && storedLong){
  //       setLatitude(storedLat);
  //       setLongitude(storedLong);
  //     }
  //     else{
  //       getPosition();
  //     }
  // }, [])
  

  return (
    <LocationContext.Provider value={{location, updateLocation}}>
      {props.children}
    </LocationContext.Provider>
  )
}

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache()
});

export default function App() {
  const classes = useStyles()
  return (
    <Router>
      <div className="App">
        <ApolloProvider client={client}>
          <LocationProvider>
            <div className={classes.root}>
              <div className="main-block">
                <Switch>
                  <AddressRoute exact path="/">
                    {/* No nav bar here because we use it in the component */}
                    <RestaurantsPage/>
                  </AddressRoute>
                  <AddressRoute path="/restaurants/:slug">
                    <NavBar/>
                    <Restaurant/>
                  </AddressRoute>
                  <AddressRoute path="/addRestaurant">
                    <NavBar/>
                    <RestaurantForm/>
                  </AddressRoute>
                  <Route path="/pickLocation">
                    <NavBar/>
                    <PickLocation/>
                  </Route>
                </Switch>
              </div>
            </div>
          </LocationProvider>
        </ApolloProvider>
      </div>
    </Router>
  )
}

function AddressRoute({children, ...rest}) {
  const {location} = useContext(LocationContext)
  console.log(children)
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        location ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/pickLocation",
              state: { from: routeProps.location }
            }}
          />
        )
      }
    />
  );
}
