import React from 'react';
import clsx from 'clsx'
import DishModal from './DishModal'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
import {Card, CardContent, Typography} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
 
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

const useStyles = makeStyles({
    dishTitle: {
        fontSize: 20
    },
    dish: {
        marginTop: '10px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f8f8f8'
        },
    },
    lineClamp: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        "-webkit-line-clamp": 2,
        "-webkit-box-orient": "vertical"
    },
    priceBadgeBlock: {
        display: 'flex',
        justifyContent: 'space-between'
    }
})

//
// YOU SHOULD MAKE THIS COMPONENT LIKE UBER EATS
//
// FIRST GET THE DESIGN, THEN DO THE MODAL, THEN WORK OUTWARD FROM THERE

function Dish (props) {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles()
    const handleDishClick = (e) => {
        e.preventDefault();
        console.log(!open)
        setOpen(!open)
    }

    let dish = props.dish
    let dietary = props.dietaryString(dish)
    let superLongText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lor"
    return (
        <React.Fragment>
            <Card onClick={handleDishClick} className={classes.dish}>
                <CardContent>
                    <Typography className={clsx(classes.dishTitle, classes.lineClamp)}>{dish.name}</Typography>
                    <Typography className={classes.lineClamp} color="textSecondary">{dish.description}</Typography>
                    <div className={classes.priceBadgeBlock}>
                        <Typography>{dish.price}</Typography>
                        <Typography color="primary" className={classes.dishTitle}>{dietary}</Typography>
                    </div>
                </CardContent>
            </Card>
            <DishModal open={open} handleClick={handleDishClick} dish={props.dish} dietary={dietary}/>
        </React.Fragment>
    )
}

export default Dish;