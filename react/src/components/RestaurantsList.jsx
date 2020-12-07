import React, {useContext} from 'react';
import { gql, useQuery } from '@apollo/client';
import Toolbar from '@material-ui/core/Toolbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { LocationContext } from '../App'
import MyLoader from "./Loader.jsx"
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const restaurantsQuery = gql`
    query GetStuff($coordinates: CoordinatesInput, $filters: FiltersInput){
      restaurant(coordinates: $coordinates, filters: $filters) {
        name,
        slug,
        titleImage,
        distance {
          text,
          value
        },
        genres,
        allVegan
      }
    }
  `

const useStyles = makeStyles((theme) => ({
    allVeganIcon: {
      '&:hover': {
        cursor: 'pointer',
     },
    }
  }))

export default function RestaurantsList(props) {
    const classes = useStyles()
    const {location} = useContext(LocationContext)

    const {loading, error, data} = useQuery(restaurantsQuery, {
        variables: {
          "coordinates": location.coordinates,
          "filters": props.filters
        }
      });

    if (loading) {
    return <MyLoader/>
    }
    if (error) {
    return <p>Something went wrong /:</p>
    }

    if (!data.restaurant.length) {
        return <p>Couldn't find any places in your area /:</p>
    }
    let restaurantsToDisplay = data.restaurant.slice()
    restaurantsToDisplay.sort(props.sortFunc);

    return (
        <GridList cols={4} spacing={20}>
            {/* <GridListTile key="Subheader" cols={4} style={{ height: 'auto' }}>
                <ListSubheader component={"h2"}>{props.filters.genres.join(", ") || "Near you"}</ListSubheader>
            </GridListTile> */}
            {
            restaurantsToDisplay.map((restaurant, i) => {
                const icon = restaurant.allVegan ? 
                  <Tooltip title="All-Vegan">
                    <IconButton 
                      color='primary'
                      disableRipple
                      disableFocusRipple
                      className={classes.allVeganIcon}
                    >
                      V
                    </IconButton>
                </Tooltip> 
                : null
                return (
                  <GridListTile className={props.classes.gridList}>
                      <a href={'/restaurants/' + restaurant.slug}>
                      <img src={restaurant.titleImage} alt={restaurant.name} className={props.classes.image}/>
                          <GridListTileBar 
                            title={restaurant.name}
                            subtitle={restaurant.distance.text}
                            actionIcon={icon}
                          />
                      </a>
                  </GridListTile>
                )
            })
            }
        </GridList>
    )
}