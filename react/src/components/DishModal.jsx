import React from 'react';
import './DishModal.css'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function DishModal (props) {
    return (
        <Dialog onClose={props.handleClick} open={props.open} TransitionComponent={Transition}>
            <DialogTitle id="simple-dialog-title">{props.dish.name}</DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText color="inherit">
                    {props.dish.description}
                </DialogContentText>
                <DialogContentText>{props.dietary}</DialogContentText>
                <DialogContentText>{props.dish.price}</DialogContentText>
            </DialogContent>
        </Dialog>
    )
}
