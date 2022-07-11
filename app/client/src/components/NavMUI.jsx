import { Link as MUILink, AppBar, Drawer, Box, Toolbar, Button, IconButton, List, ListItem, Container, Typography, Divider } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // This is what we are using right now, as MUILink refreshes the page and logs the user out. Seems like a session problem.

//const drawerWidth = 240;
const navItems = ['Forms', 'Filters', 'Exercises'];
const authPages = ['Register', 'Login'];

const NavMUI = (props) => {
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

    useEffect(() => {
        setPages(props.user ? navItems : authPages);
        console.log(props.user);
    }, [props])


    const drawer = <Box onClick={handleDrawerToggle}>
        <Typography
            variant='h6'
            sx={{ my: 2, mx: 3, color: '#373737' }}>
            MyFitnessCal
        </Typography>
        <Divider />

        <List>
            {pages.map((item) => (
                <ListItem key={item}>
                    <Button>
                        {/* <MUILink sx={{ textDecoration: 'none' }} href={`/${item.toLowerCase()}`}>{item}</MUILink> */}
                        <Link
                            to={`/${item.toLowerCase()}`}
                            className='text-decoration-none drawerLink'>
                            {item}
                        </Link>
                    </Button>
                </ListItem>
            ))}
            {props.user ?
                <ListItem>
                    <Button onClick={handleLogout}>
                        <span className='drawerLink'>Logout |
                            <span className="text-success">{props.user}</span>
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
                        <IconButton color='inherit' onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                            <Menu />
                        </IconButton>

                        {/* Title */}
                        <Typography variant='h6' component='div' sx={{ flexGrow: 1, display: { xs: 'block' } }}>
                            MyFitnessCal
                        </Typography>

                        {/* Row of pages shown when expanded */}
                        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            {
                                pages.map((page) => (
                                    <Button key={page} sx={{ my: 2, display: 'block' }}>
                                        {/* <MUILink sx={{ color: 'white' }} href={`/${page.toLowerCase()}`}>{page}</MUILink> */}
                                        <Link
                                            to={`/${page.toLowerCase()}`}
                                            className='text-white text-decoration-none'>
                                            {page}
                                        </Link>
                                    </Button>
                                ))
                            }
                            {props.user ?
                                <Button sx={{ color: 'white' }} onClick={handleLogout}>
                                    Logout |<span className="ms-1 text-success">{props.user}</span>
                                </Button>
                                : null}
                        </Box>

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
                    sx={{ display: { xs: 'block', sm: 'none' }, boxSizing: 'border-box' }}>
                    {drawer}
                </Drawer>
            </Box>
        </Box >
    )

}

export default NavMUI;