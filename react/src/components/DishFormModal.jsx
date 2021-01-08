import React from 'react';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { gql, useMutation } from '@apollo/client';
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import NumberFormat from 'react-number-format';
import { useForm, Controller } from "react-hook-form";
import {TextField, Button, Checkbox} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Loader from "./Loader.jsx"

import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

const mutation = gql`
    mutation InsertDish($dish: DishInput, $restSlug: String, $dishGroup: String){
        createDish(dish: $dish, restSlug: $restSlug, dishGroup: $dishGroup){
            name,
            dishGroups {
                name,
                dishes {
                    name
                }
            }
        }
    }
`
function createNewDish (inputVals, restSlug) {
    let isVegan
    let isVeganAvailable
    switch(String(inputVals.dietary)) {
        case 'vegan':
            isVegan = true;
            isVeganAvailable = false;
            break
        case 'veganAvailable':
            isVegan = false;
            isVeganAvailable = true;
            break
        default:
            return null
    }
    return (
        {
            "name": inputVals.name,
            "price": inputVals.price,
            "isVegan": isVegan,
            "isVeganAvailable": isVeganAvailable,
            "description": inputVals.description,
        }

    )
}


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    dishForm: {
        display: "flex",
        flexDirection: "column",
    },
    error: {
        color: "red"
    },
    submitBtn: {
        marginTop: '20px'
    }
}));

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
    description : {
        required: 'Gotta have that description my guy',
        maxLength: {
            value: 160,
            message: 'Description must be 160 characters or fewer'
        },
        minLength: {
            value: 3,
            message: 'Description must be 3 characters or more'
        }
    },
    price: {
        required: 'You must set a price',
        pattern:{
            value: /^[0-9]{1,}\.[0-9]{2}/,
            message: 'Price must be in a valid format'
        } 
    },
    dietary: {
        required: 'Gotta pick one'
    },
    dishGroup: {
        required: 'Gotta pick one'
    }
}


export default function DishFormModal (props) {
    const { register, control, errors, handleSubmit } = useForm();
    const classes = useStyles();
    var mutationErr
    const [addDish, {data, error, loading}] = useMutation(mutation, {onError(err) {
        mutationErr = err
    }})

    const onSubmit = (e) => {
        const dish = createNewDish(e, props.restaurantSlug)
        if (!dish) {
            console.error('Something went wrong creating the dish /:');
            return
        }
        addDish({
            variables: {
                dish: dish,
                restSlug: props.restaurantSlug,
                dishGroup: e.dishGroup
            },
        })
    }

    let dialogContent
    let dialogTitle = null
    if (loading) {
        dialogContent = <Loader/>
    }
    else if (error || mutationErr) {
        dialogContent = <div>Something went wrong, please try again later.</div>
    }
    else if (data) {
        dialogContent = <div>Thank you for your suggestion, we'll let you know it's added!</div>
    }
    else {
        dialogTitle = <DialogTitle id="simple-dialog-title">Submit a dish to be added</DialogTitle>
        dialogContent = (
            <form className={classes.dishForm} onSubmit={handleSubmit(onSubmit)}>
                    <TextField 
                        name="name"
                        inputRef={register(validation.name)}
                        label="Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <TextField 
                        name="description"
                        inputRef={register(validation.description)}
                        label="Description"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />
                    <TextField 
                        name="price"
                        inputRef={register(validation.price)}
                        label="Price"
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        placeholder="$"
                    />
                    {/* <NumberFormat value={2456981} thousandSeparator={true} prefix={'$'} />  */}

                    <Controller
                        defaultValue=""
                        rules={validation.dietary}
                        as={
                            <RadioGroup 
                                name="dietary"
                                // inputRef={register(validation.dietary)}
                                label="Dietary"
                                
                            >
                                <FormControlLabel value="vegan" label="Vegan" control={<Radio color="primary"/>}/>
                                <FormControlLabel value="veganAvailable" label="Vegan Available" control={<Radio color="primary"/>}/>
                            </RadioGroup>
                        }
                        name="dietary"
                        control={control}
                    />
                    {!!errors.dietary && <p className={classes.error}>You must pick one</p>}

                    <Controller
                        defaultValue=""
                        rules={validation.dishGroup}
                        as={
                            <Select 
                                name="dishGroup"
                                // inputRef={register(validation.dietary)}
                                label="Menu Section"
                                error={errors.dishGroup}
                                helperText={errors.dishGroup?.message}
                                input={<Input/>}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                    },
                                    transformOrigin: {
                                        vertical: -50,
                                        horizontal: "left"
                                    },
                                    getContentAnchorEl: null
                                }}
                                
                            >
                                <MenuItem value="" disabled>Menu Section</MenuItem>
                                {props.dishGroups.map((group) => (
                                    <MenuItem key={group} value={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </Select>
                        }
                        name="dishGroup"
                        control={control}
                    />
                    
                    <Button variant="contained" color="primary" type="submit" className={classes.submitBtn}>Submit a Dish</Button>
                </form>
        )
    }
    return (
        <Dialog onClose={props.handleClick} open={props.open} TransitionComponent={Transition}>
            {dialogTitle}
            <DialogContent dividers={true}>
                {dialogContent}
            </DialogContent>
        </Dialog> 
    )
}

