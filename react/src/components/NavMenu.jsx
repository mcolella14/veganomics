import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';

export default function NavMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div className={props.className}>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <AccountCircle color="inherit"/>
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{vertical: -30}}
            >   
                <a href="/">
                    <MenuItem onClick={handleClose}>Home</MenuItem>
                </a>
                <a href="/addRestaurant">
                    <MenuItem onClick={handleClose}>Add a Restauarant</MenuItem>
                </a>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    )
}