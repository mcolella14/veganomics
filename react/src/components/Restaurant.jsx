import React from 'react';
import { useContext, useState } from 'react';
import Dish from './Dish'
import './Restaurant.css';
import { useQuery, gql } from '@apollo/client';
import Typography from '@material-ui/core/Typography';

import DishFormModal from './DishFormModal';
import Loader from './Loader.jsx'
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

import {useParams} from "react-router-dom";

import { LocationContext } from '../App'

const useStyles = makeStyles((theme) => ({
  websiteLink: {
    color: "black",
    textDecoration: "none",
    cursor: "pointer",
    margin: "5px 0 5px 0"
  },
  // orderingLink: {
  //   borderColor: theme.palette.secondary.main,
  //   margin: "5px 0 5px 0"
  // }
}))

const restaurantQuery = gql`
  query GetRestuarant($slug: String, $coordinates: CoordinatesInput){
    restaurant(slug: $slug, coordinates: $coordinates){
      name,
      slug,
      dishGroups {
        name,
        dishes {
          name,
          price,
          isVegan,
          isVeganAvailable,
          description
        }
      },
      location {
        coordinates {
          latitude,
          longitude,
        },
        address
      },
      distance {
        text,
        value
      },
      genres,
      websiteUrl,
      onlineOrdering {
        doorDash,
        uberEats,
        postmates
      },
      allVegan
    }
  }
`;

function dietaryString(dish) {
  var flags = []
  if (dish.isVegan) {
      flags.push('v');
  } else if (dish.isVeganAvailable) {
      flags.push('va');
  }
  return flags.join(', ');
}

function Restaurant (props) {
    const classes = useStyles()
    const {slug} = useParams()
    const [modalOpen, setModalOpen] = useState(false);

    const {location} = useContext(LocationContext)

    const handleModalClick = (e) => {
      e.preventDefault();
      console.log(modalOpen);
      setModalOpen(!modalOpen);
    }

    const {loading, error, data} = useQuery(restaurantQuery, {
      variables: {
        "slug": slug,
        "coordinates": location.coordinates
      }
    });

    if (loading) {
      return <Loader/>
    }
    if (error) {
      return <p>Something went wrong /:</p>
    }
    let headerText
    let dishList = []
    const restaurant = data.restaurant[0]
    if (restaurant.allVegan ) {
      headerText = restaurant.name + ' is  an all-vegan restaurant, check out their website with the link above and go crazy!'
    }
    else if (restaurant.dishGroups.length > 0) {
      
      headerText = 'See something missing for ' + restaurant.name + '? Submit a new dish to be added to the site'
      restaurant.dishGroups.forEach(group => {
        const groupList = (
          <div className={'dish-list'}>
            <Typography>{group.name}</Typography>
            {group.dishes.map((dish, i) => {
                return <Dish key={dish.name} dish={dish} dietaryString={dietaryString}/>
            })}
          </div>
        )
        dishList.push(groupList);
      })
    }
    else {
      headerText = "Looks like there aren't any dishes for " + restaurant.name + " yet, but you can submit a suggestion here!"
    }

    const onlineOrderingObj = {}
    
    for (const key in restaurant.onlineOrdering) {
      if (key != '__typename' && restaurant.onlineOrdering[key]) {
        onlineOrderingObj[key] = restaurant.onlineOrdering[key]
      }
    } 
    console.log(onlineOrderingObj)
    let onlineOrderingButtons
    if (onlineOrderingObj) {
      onlineOrderingButtons = 
        <ButtonGroup>
          {
            Object.entries(onlineOrderingObj).map((obj) => {
              return <Button key={obj[0]} href={obj[1]} target="_blank" rel="noopener" color="primary">{obj[0]}</Button>
            })
          }
        </ButtonGroup>
    } else {
      onlineOrderingButtons = null
    }

    console.log(onlineOrderingButtons)

    return (
      <div>
        <Typography variant="h3">{restaurant.name}</Typography>
        {restaurant.websiteUrl &&
          <Button href={restaurant.websiteUrl} className={classes.websiteLink} target="_blank" rel="noopener">
            {restaurant.websiteUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}
          </Button>
        }
        <div>
          {onlineOrderingButtons && onlineOrderingButtons}
        </div>
        {dishList && dishList}
        <DishFormModal open={modalOpen}
                      handleClick={handleModalClick}
                      restaurantSlug={slug}
                      dishGroups={restaurant.dishGroups.map(el => el.name)}/>
        <Typography>
          {headerText}
          {!restaurant.allVegan &&
            <IconButton onClick={handleModalClick} color="green">
              <AddIcon/>
            </IconButton>
          }
        </Typography>
      </div>
    )
}

export default Restaurant