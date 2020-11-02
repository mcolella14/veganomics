import React from 'react';
import './Dish.css';
import DishModal from './DishModal'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
 
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

//
// YOU SHOULD MAKE THIS COMPONENT LIKE UBER EATS
//
// FIRST GET THE DESIGN, THEN DO THE MODAL, THEN WORK OUTWARD FROM THERE

function Dish (props) {
    const [open, setOpen] = React.useState(false);

    const handleDishClick = (e) => {
        e.preventDefault();
        console.log(!open)
        setOpen(!open)
    }

    let dish = props.dish
    let dietary = props.dietaryString(dish)
    let superLongText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lor"
    return (
        <div>
            <div className="dish-block" onClick={handleDishClick}>
                <div className="line-clamp dish-name" >{dish.name}</div>
                <div className="dish-info-block">
                    <p className="dish-description line-clamp">{dish.description}</p>
                </div>
                <div className="dish-price">${dish.price}</div>
                <div className="dish-dietary">
                    {dietary}
                </div>
            {/* <DishForm/> */}
            </div>
            <DishModal open={open} handleClick={handleDishClick} dish={props.dish} dietary={dietary}/>
        </div>
    )
}

export default Dish;