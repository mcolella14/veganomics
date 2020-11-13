import React, {useContext} from 'react';
import { gql, useQuery } from '@apollo/client';
import Toolbar from '@material-ui/core/Toolbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { LocationContext } from '../App'
import MyLoader from "./Loader.jsx"

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
        genres
      }
    }
  `

export default function RestaurantsList(props) {
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
                return (
                
                <GridListTile className={props.classes.gridList}>
                    <a href={'/restaurants/' + restaurant.slug}>
                    <img src={restaurant.titleImage} alt={restaurant.name} className={props.classes.image}/>
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
    )
}