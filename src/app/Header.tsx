"use client"

import Link from 'next/link';
import { Box, AppBar, Toolbar, IconButton, MenuIcon, Typography, Button, Menu, MenuItem, React } from './libs'
import { useState } from 'react';
import {usePathname} from 'next/navigation'


const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const pathname = usePathname()
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getTitle = (str: String) => {
        str = str.replace('/', '')
        return str === '' ? 'HomePage' : str
    } 

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>
                            <Link href={'/'}>Home</Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link href={'/books'}>Book</Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link href={'/authors'}>Author</Link>
                        </MenuItem>
                    </Menu>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textTransform: 'capitalize', textAlign: 'center' }}>
                        {getTitle(pathname)}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header;