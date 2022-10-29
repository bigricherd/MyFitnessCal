import { AppBar, Drawer, Box, Toolbar, Button, IconButton, List, ListItem, Container, Typography, Divider, Stack } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // This is what we are using right now, as MUILink refreshes the page and logs the user out. Seems like a session problem.

//const drawerWidth = 240;
const navItems = ['Sessions', 'Exercises', 'Analytics'];
const authPages = ['Register', 'Login'];

const Nav = (props) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pages, setPages] = useState(authPages);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/auth/logout`, { credentials: "include" });
        if (res.ok) {
            window.location = '/';
        }
    }

    // Set the list of pages depending on whether a user is logged in
    useEffect(() => {
        setPages(props.user ? navItems : authPages);
    }, [props])


    // Sidebar that opens when the hamburger icon is clicked
    const drawer = <Box onClick={handleDrawerToggle}>
        <Typography
            variant='h6'
            sx={{ my: 2, mx: 3, color: '#373737' }}>
            MyFitnessCal
        </Typography>
        <Divider />

        <List>
            {/* List of pages */}
            {pages.map((item) => (
                <ListItem key={item}>
                    <Button>
                        <Link
                            to={`/${item.toLowerCase()}`}
                            className='drawerLink'
                            style={{
                                textDecoration: "none",
                                color: "#515151"
                            }}
                        >
                            {item}
                        </Link>
                    </Button>
                </ListItem>
            ))}

            {/* Logout button if a user is logged in */}
            {props.user ?
                <ListItem>
                    <Button onClick={handleLogout}>
                        <span style={{ color: "#515151" }}>Logout |
                            <span style={{ marginLeft: "3px", color: '#588157' }}>{props.user}</span>
                        </span>
                    </Button>
                </ListItem>
                : null}
        </List>
    </Box >


    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar>
                <Container>
                    <Toolbar>

                        {/* Hamburger icon shown when collapsed + options shown on click */}
                        <IconButton color='inherit' onClick={handleDrawerToggle} sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}>
                            <Menu />
                        </IconButton>

                        {/* Title */}
                        <Typography variant='h6' component='div' sx={{ flexGrow: 1, display: { xs: 'block' } }}>
                            MyFitnessCal
                        </Typography>

                        {/* Row of pages shown when expanded. */}
                        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {
                                props.user && pages.map((page) => (
                                    <Button key={page} sx={{ my: 2, display: 'block' }}>
                                        <Link
                                            to={`/${page.toLowerCase()}`}
                                            style={{
                                                color: "white",
                                                textDecoration: "none"
                                            }}>
                                            {page}
                                        </Link>
                                    </Button>
                                ))
                            }
                            {props.user ?
                                <Button sx={{ color: 'white' }} onClick={handleLogout}>
                                    Logout | <span style={{ marginLeft: "3px", color: "#c8e6c9" }}>{props.user}</span>
                                </Button>
                                : null}
                        </Stack>

                    </Toolbar>
                </Container>
            </AppBar>

            {/* Sidebar shown by clicking <Menu/> in <IconButton> above, hid by clicking anywhere else */}
            <Box component='nav'>
                <Drawer
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block' }, boxSizing: 'border-box' }}>
                    {drawer}
                </Drawer>
            </Box>
        </Box >
    )

}

export default Nav;