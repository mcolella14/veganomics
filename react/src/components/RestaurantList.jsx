import React, {useContext} from 'react';
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

import {allRestaurantsTest} from '../assets/test_data.json'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { LocationContext } from '../App'
import MyLoader from "./Loader"

const testUrl = 'https://veganomics.s3.us-east-2.amazonaws.com/Restaurants/Cleveland+Vegan/cleveland_vegan_logo.png';


const useStyles = makeStyles((theme) => ({
  resList: {
    padding: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    borderRadius: '0px',
  }
}))

const restaurantsQuery = gql`
    query GetStuff($coordinates: CoordinatesInput){
      restaurant(coordinates: $coordinates) {
        name,
        slug,
        location {
          coordinates {
            latitude,
            longitude
          }
        },
        titleImage,
        distance {
          text,
          value
        }
      }
    }
  `

function RestaurantList (props){
  const {location} = useContext(LocationContext)
  const {loading, error, data} = useQuery(restaurantsQuery, {
    variables: {
      "coordinates": location.coordinates
    }
  });
  const classes = useStyles();
  
  if (loading) {
    return <MyLoader/>
  }
  if (error) {
    return <p>Something went wrong /:</p>
  }

  // MAYBE IMPLEMENT THE DISTANCE THING IN GO SO IT CAN BE RETURNED FROM GRAPHQL
  return (
    <div>
      <div className={classes.resList}>
        <GridList cols={4} spacing={20}>
        <GridListTile key="Subheader" cols={4} style={{ height: 'auto' }}>
          <ListSubheader component="h2">Near You</ListSubheader>
        </GridListTile>
        {
          data.restaurant.slice().sort((a, b) => a.distance.value - b.distance.value).map((restaurant, i) => {
            return (
              
              <GridListTile className={classes.gridList}>
                <a href={'/restaurants/' + restaurant.slug}>
                  <img src={restaurant.titleImage} alt={restaurant.name} className={classes.image}/>
                    <GridListTileBar 
                      title={restaurant.name}
                      subtitle={restaurant.distance.text}
                    />
                </a>
              </GridListTile>
            )
          })
        }
        </GridList>
      </div>
    </div>
  )
}

export default RestaurantList;