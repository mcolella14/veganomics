import React, {useContext, useState} from 'react';
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

import NavBar from './NavBar'

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { LocationContext } from '../App'
import MyLoader from "./Loader"
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const testUrl = 'https://veganomics.s3.us-east-2.amazonaws.com/Restaurants/Cleveland+Vegan/cleveland_vegan_logo.png';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    borderRadius: '0px',
  },
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawerPaper: {
    width: 240,
  },
}));

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

function RestaurantList (props){
  const {location} = useContext(LocationContext)
  const classes = useStyles();
  const [ sortFunc, setSortFunc ] = useState(
    () => {
      return (a, b) => a.distance.value - b.distance.value
    }
  )
  const [ filters, setFilters ] = useState({
    "genres": []
  })
  const {loading, error, data} = useQuery(restaurantsQuery, {
    variables: {
      "coordinates": location.coordinates,
      "filters": filters
    }
  });
  
  if (loading) {
    return <MyLoader/>
  }
  if (error) {
    return <p>Something went wrong /:</p>
  }

  let restaurantsToDisplay = data.restaurant.slice()
  restaurantsToDisplay.sort(sortFunc);

  const handleFilterClick = (type, value) => {
    
    const currentVals = filters[type];
    
    if (currentVals.includes(value)) {
      setFilters( prevFilters => {
        return {...prevFilters, [type]: currentVals.filter(el => el != value)}
      })
    } else{
      setFilters( prevFilters => {
        const newVals = currentVals.slice()
        newVals.push(value)
        
        return {...prevFilters, [type]: newVals}
      })
    }
    
  }

  return (
    <div className={classes.root}>
      <NavBar className={classes.appBar}/>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {['American', 'Mexican', 'Chinese', 'Thai'].map((text, i) => (
              <ListItem button key={i} selected={filters.genres.includes(text)} onClick={() => handleFilterClick("genres", text)}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          {/* <Divider /> */}
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar/>
        <GridList cols={4} spacing={20}>
        <GridListTile key="Subheader" cols={4} style={{ height: 'auto' }}>
            <ListSubheader component={"h2"}>{filters.genres.join(", ") || "Near you"}</ListSubheader>
        </GridListTile>
        {
          restaurantsToDisplay.map((restaurant, i) => {
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
      </main>
    </div>
  )
}

export default RestaurantList;
