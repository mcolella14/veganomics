import React from 'react';
import slugify from 'slugify'
import { useState, useEffect } from 'react';
import {TextField, Button, FormControlLabel} from '@material-ui/core'
import { gql, useMutation } from '@apollo/client';
import MyLoader from "./Loader.jsx";
import FormMap from "./Map";
import "./RestaurantForm.css"
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Select from '@material-ui/core/Select';
import { useForm, Controller} from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import InputLabel from '@material-ui/core/InputLabel';
import { ErrorMessage } from '@hookform/error-message';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';

import MultiSelect from './MultiSelect'


import { LocationContext } from '../App'

const genreList = [
    "Mexican",
    "American",
    "Thai",
    "Chinese"
]

const useStyles = makeStyles((theme) => ({
    error: {
      color: 'red',
    },
    input: {
        marginTop: '10px',
        width: '50%'
    },
    mapInput: {
        paddingBottom: '30px'
    },
    submitButton: {
        marginTop: '35px'
    },
    onlineBox: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start'
    }
  }))

const mutation = gql`
    mutation createRestaurant($restaurant: RestaurantInput){
        createRestaurant(restaurant: $restaurant){
            slug,
            name
        }
    }
`

const validation = {
    name: {
        required: 'Name cannot be blank',
        maxLength: {
            value: 30,
            message: 'Name must be 30 characters or fewer'
        },
        minLength: {
            value: 3,
            message: 'Name must be 3 characters or more'
        }
    },
    urlRequired: {
        required: 'This field is required',
        pattern:{
            value: /^(https?):\/\/[^\s$.?#].[^\s]*$/,
            message: 'Must be a valid url'
        } 
    },
    url: {
        pattern:{
            value: /^(https?):\/\/[^\s$.?#].[^\s]*$/,
            message: 'Must be a valid url'
        } 
    },
    location: {
        required: 'You must pick a location'
    },
    genres: {
        validate: {
            atLeastOne: (val) => val.length > 0 || "Must select 1 or more genre",
            fewerThanSix:(val) => val.length < 6 || "Must select 5 or fewer genres"
        }
    },
    menuSections: {
        validate: {
            atLeastOne: (val) => val.length > 0 || "Must select 1 or more menu section",
        }
    }
}

function createNewRestaurant (inputVals) {
    let slug = slugify(inputVals.name, {strict: true, lower: true})
    const dishGroups = inputVals.menuSections?.map(el => {
        return {
            name: el,
            dishes: []
        }
    })
    if (inputVals.allVegan) {
        inputVals.genres.push("All-Vegan");
    }
    return (
        {
            "name": inputVals.name,
            "slug": slug,
            "dishGroups": dishGroups || null,
            "location": {
                "address" : inputVals.location.formatted_address,
                "coordinates": inputVals.location.coordinates
            },
            "titleImage": inputVals.titleImage,
            "genres": inputVals.genres,
            "websiteUrl": inputVals.websiteUrl,
            "onlineOrdering": {
                "doorDash": inputVals.doorDashUrl || null,
                "uberEats": inputVals.uberEatsUrl  || null,
                "postmates": inputVals.postmatesUrl  || null,
            },
            "allVegan": inputVals.allVegan
        }
    )
    }
function RestaurantForm (props) {
    const classes = useStyles();
    const [ currentSectionName, setCurrentSectionName ] = useState(null)
    const [ mutationError, setMutationError ] = useState(null)
    const [ location, setLocation] = useState(null)
    const { register, errors, handleSubmit, watch, setValue, control} = useForm();
    const genres = watch("genres");
    const menuSections = watch("menuSections")
    const allVegan = watch("allVegan")
    const [addRestaurant, {data, loading}] = useMutation(mutation, {onError: e => setMutationError(e)})

    const [ doorDash, setDoorDash ] = useState(false)
    const [ uberEats, setUberEats ] = useState(false)
    const [ postmates, setPostmates ] = useState(false)    

    const handleLocationChange = (location) => {
        console.log(location)
        setLocation({
            'formatted_address': location.formatted_address,
            'name': location.name,
            'coordinates': {
                'latitude': location.geometry.location.lat(),
                'longitude': location.geometry.location.lng()
            },
        });
    }

    const handleSectionChange = () => {
        setValue("menuSections", menuSections.concat([currentSectionName]));
    }

    const handleValueDelete = (chipToDelete) => {
        setValue("menuSections", menuSections.filter((chip) => chip !== chipToDelete));
    };

    const onSubmit = (e) => {
        e.location = location
        e.genres = genres
        e.menuSections = menuSections
        e.allVegan = allVegan
        const restaurant = createNewRestaurant(e)
        console.log(restaurant);
        addRestaurant({
            variables: {restaurant: restaurant},
        })
    }

    if (loading) {
        return <MyLoader/>
    }
    if (mutationError) {
        console.log(mutationError.message)
    return <div>{mutationError.message}</div>
    }
    if (data) {
        const link = "/restaurants/" + data.createRestaurant.slug
        return (
            <div>
                <div>Success!</div>
                <a href={link}>Check out {data.createRestaurant.name}</a>
            </div>
        )
    }
    return (
        <div>
            <form id="restaurant-form" onSubmit={handleSubmit(onSubmit)}>
                <React.Fragment>
                    <TextField 
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        name="name"
                        label="Name"
                        inputRef={register(validation.name)}
                        className = {classes.input}
                    />
                </React.Fragment>
                <React.Fragment>
                    <Controller
                        name="allVegan"
                        control={control}
                        defaultValue={false}
                        value={allVegan}
                        as={
                            <FormControlLabel
                                label="All-Vegan"
                                control={
                                    <Checkbox
                                        name="allVegan"
                                        onChange={e => setValue("allVegan", e.target.checked)}
                                    />
                                }
                            />
                        }
                    />
                </React.Fragment>
                {
                    !allVegan &&
                    <React.Fragment>
                    <FormControl  className={classes.input}>
                        <Controller 
                            name="menuSections"
                            value={menuSections}
                            control={control} 
                            defaultValue={[]}
                            rules={{
                                validate: {
                                    atLeastOne: (val) => {
                                        return (val.length > 0 || allVegan) || "Must select 1 or more menu section"
                                    }
                                }
                            }}
                            as= {
                                <React.Fragment>
                                    <TextField
                                        hidden={true}
                                        name="menuSection"
                                        error={!!errors.menuSections}
                                        helperText={errors.menuSections?.message}
                                        label="Menu Section (Skip if All Vegan)"
                                        onChange={e => setCurrentSectionName(e.target.value)}
                                    />
                                    <Button onClick={handleSectionChange}>Add Menu Section</Button>
                                </React.Fragment>
                            }
                        />
                    </FormControl>
                </React.Fragment>
                }
                
                { menuSections &&
                    menuSections.map((value) => (
                        <Chip 
                            onMouseDown={(event) => {
                                event.stopPropagation();
                            }}
                            key={value}
                            label={value}
                            clickable
                            onDelete={() => handleValueDelete(value)}
                            deleteIcon={<CloseIcon/>}
                        />
                    ))
                }
                <React.Fragment>
                    <TextField 
                        error={!!errors.titleImage}
                        helperText={errors.titleImage?.message}
                        name="titleImage"
                        label="Title Image"
                        inputRef={register(validation.urlRequired)}
                        className = {classes.input}
                    />
                </React.Fragment>
                <React.Fragment>
                    <TextField 
                        error={!!errors.websiteUrl}
                        helperText={errors.websiteUrl?.message}
                        name="websiteUrl"
                        label="Website URL"
                        inputRef={register(validation.url)}
                        className = {classes.input}
                    />
                </React.Fragment>
                <div className={classes.mapInput} id="map-container">
                    <FormMap 
                        onLocationChange={handleLocationChange}
                        inputRef={register(validation.location)}
                        error={!!errors.location}
                        helperText={errors.location?.message}
                        className = {classes.input}
                    />
                </div>
                { location && (
                    <Typography>
                        <Link
                            href={"https://www.google.com/search?q=" + encodeURIComponent(location.formatted_address)}
                            // onClick={e => e.preventDefault()}
                            target="_blank"
                            rel="noopener"
                        >
                            {location.name}
                        </Link>
                    </Typography>
                )}
                <React.Fragment>
                    <MultiSelect
                        label="Genres"
                        value={genres}
                        control={control}
                        defaultValue={[]}
                        rules={validation.genres}
                        error={!!errors.genres}
                        helperText={errors.genres?.message}
                        name="genres"
                        setValue={setValue}
                        className={classes.input}
                        possVals={genreList}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="genres"
                        as={<Typography className="MuiFormHelperText-root Mui-error"/>}
                    />
                </React.Fragment>
                <React.Fragment>
                <FormControl component="fieldset" className={classes.input}>
                    <FormLabel component="legend">Online Ordering</FormLabel>
                    <FormGroup>
                        <div className={classes.onlineBox}>
                            <FormControlLabel
                                control={<Checkbox checked={doorDash} 
                                onChange={() => setDoorDash(!doorDash)} 
                                name="doorDash" />}
                                label="DoorDash"
                            />
                            {doorDash &&
                                <TextField
                                    name="doorDashUrl"
                                    label="Door Dash URL"
                                    error={!!errors.doorDashUrl}
                                    helperText={errors.doorDashUrl?.message}
                                    inputRef={register(validation.urlRequired)}
                                />
                            }
                        </div>
                        <div className={classes.onlineBox}>
                            <FormControlLabel
                                control={<Checkbox checked={uberEats} onChange={() => setUberEats(!uberEats)} name="uberEats" />}
                                label="Uber Eats"
                            />
                            {uberEats &&
                                <TextField
                                    name="uberEatsUrl"
                                    label="Uber Eats URL"
                                    error={!!errors.uberEatsUrl}
                                    helperText={errors.uberEatsUrl?.message}
                                    inputRef={register(validation.urlRequired)}
                                />
                            }
                        </div>
                        <div className={classes.onlineBox}>
                            <FormControlLabel
                                control={<Checkbox checked={postmates} onChange={() => setPostmates(!postmates)} name="postmates" />}
                                label="Postmates"
                            />
                            {postmates &&
                                <TextField
                                    name="postmatesUrl"
                                    label="Postmates URL"
                                    error={!!errors.postmatesUrl}
                                    helperText={errors.postmatesUrl?.message}
                                    inputRef={register(validation.urlRequired)}
                                />
                            }
                        </div>
                    </FormGroup>
                </FormControl>
                </React.Fragment>
                <div className={classes.submitButton}>
                    <Button type="submit">Create Restaurant</Button>
                </div>
            </form>

        </div>
    )
}

export default RestaurantForm
